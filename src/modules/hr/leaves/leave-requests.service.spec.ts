import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { LeaveRequestsService } from './leave-requests.service';
import { LeaveRequestStatus } from '@common/enums';

/**
 * These cover the rules added in the leave overhaul: entitlement, overlap and
 * self-approval. The repository layer is stubbed, so they assert the decision
 * logic rather than the SQL.
 */

type Stub = Record<string, any>;

function makeQueryBuilder(result: { one?: any; raw?: any }) {
  const qb: Stub = {};
  for (const m of ['where', 'andWhere', 'select', 'leftJoinAndSelect']) {
    qb[m] = jest.fn(() => qb);
  }
  qb.getOne = jest.fn().mockResolvedValue(result.one ?? null);
  qb.getRawOne = jest.fn().mockResolvedValue(result.raw ?? { used: '0' });
  return qb;
}

function makeService(opts: {
  employee?: any;
  leaveType?: any;
  overlapping?: any;
  usedDays?: string;
  existing?: any;
  onSave?: (entity: any) => void;
}) {
  const saved: any[] = [];

  const repoFor = (entityName: string): Stub => ({
    createQueryBuilder: () =>
      makeQueryBuilder({
        one: opts.overlapping ?? null,
        raw: { used: opts.usedDays ?? '0' },
      }),
    findOne: jest
      .fn()
      .mockResolvedValue(
        entityName === 'Employee'
          ? (opts.employee ?? { id: 'emp-1' })
          : entityName === 'LeaveType'
            ? (opts.leaveType ?? null)
            : (opts.existing ?? null),
      ),
    create: (v: any) => v,
    save: jest.fn((v: any) => {
      saved.push(v);
      opts.onSave?.(v);
      return Promise.resolve(v);
    }),
  });

  const dataSource: Stub = {
    getRepository: (entity: any) => repoFor(entity.name),
    query: jest.fn().mockResolvedValue([{ current_value: 1 }]),
    transaction: (fn: any) =>
      fn({ getRepository: (entity: any) => repoFor(entity.name) }),
  };

  const service = new LeaveRequestsService({
    getDataSource: () => Promise.resolve(dataSource),
    getRepository: () => Promise.resolve(repoFor('LeaveRequest')),
  } as any);

  return { service, saved };
}

// getNextSequence hits the DB; stub it out for these unit tests.
jest.mock('@common/utils/sequence.util', () => ({
  getNextSequence: jest.fn().mockResolvedValue('LR-000001'),
}));

describe('LeaveRequestsService.create', () => {
  const baseDto = {
    employeeId: 'emp-1',
    leaveTypeId: 'lt-1',
    fromDate: '2026-03-02',
    toDate: '2026-03-04',
  };

  it('rejects a date range that ends before it starts', async () => {
    const { service } = makeService({ leaveType: { id: 'lt-1' } });
    await expect(
      service.create({
        ...baseDto,
        fromDate: '2026-03-05',
        toDate: '2026-03-01',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('refuses a request that overlaps an existing one', async () => {
    const { service } = makeService({
      leaveType: { id: 'lt-1', isActive: true, maxDaysPerYear: 0 },
      overlapping: { requestNumber: 'LR-000042', status: 'APPROVED' },
    });
    await expect(service.create(baseDto)).rejects.toThrow(/LR-000042/);
  });

  it('refuses a request that would exceed the yearly entitlement', async () => {
    const { service } = makeService({
      leaveType: {
        id: 'lt-1',
        isActive: true,
        maxDaysPerYear: 10,
        name: 'Annual',
      },
      usedDays: '9', // 9 used + 3 requested > 10
    });
    await expect(service.create(baseDto)).rejects.toThrow(
      /only 1 of 10 remain/,
    );
  });

  it('allows a request that exactly fits the remaining entitlement', async () => {
    const { service, saved } = makeService({
      leaveType: {
        id: 'lt-1',
        isActive: true,
        maxDaysPerYear: 10,
        requiresApproval: true,
      },
      usedDays: '7', // 7 + 3 == 10
    });
    await service.create(baseDto);
    expect(saved[0].totalDays).toBe(3);
    expect(saved[0].status).toBe(LeaveRequestStatus.PENDING);
  });

  it('treats maxDaysPerYear of 0 as uncapped', async () => {
    const { service, saved } = makeService({
      leaveType: {
        id: 'lt-1',
        isActive: true,
        maxDaysPerYear: 0,
        requiresApproval: true,
      },
      usedDays: '999',
    });
    await service.create(baseDto);
    expect(saved).toHaveLength(1);
  });

  it('auto-approves a leave type that needs no sign-off', async () => {
    const { service, saved } = makeService({
      leaveType: {
        id: 'lt-1',
        isActive: true,
        maxDaysPerYear: 0,
        requiresApproval: false,
      },
    });
    await service.create(baseDto);
    expect(saved[0].status).toBe(LeaveRequestStatus.APPROVED);
  });

  it('refuses an inactive leave type', async () => {
    const { service } = makeService({
      leaveType: { id: 'lt-1', isActive: false, name: 'Sabbatical' },
    });
    await expect(service.create(baseDto)).rejects.toThrow(/no longer active/);
  });
});

/**
 * Ownership is `createdBy` — the master user id of whoever submitted the
 * request — never `employeeId`. Users live in the master database and
 * employees in the tenant, with no relation between them, so those two ids
 * can never be compared.
 */
describe('LeaveRequestsService approval rules', () => {
  const pending = (over: Record<string, unknown> = {}) => ({
    id: 'lr-1',
    employeeId: 'emp-1',
    createdBy: 'user-1',
    status: LeaveRequestStatus.PENDING,
    ...over,
  });

  it('refuses to let the submitter decide their own request', async () => {
    const { service } = makeService({ existing: pending() });
    await expect(service.approve('lr-1', 'user-1')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('allows a different approver', async () => {
    const { service, saved } = makeService({ existing: pending() });
    await service.approve('lr-1', 'user-2');
    expect(saved[0].status).toBe(LeaveRequestStatus.APPROVED);
    expect(saved[0].approvedBy).toBe('user-2');
  });

  it('does not block on employeeId, which is a different namespace', async () => {
    // The approver's user id happens to equal the subject's employee id.
    // That is a coincidence, not self-approval, and must not be blocked.
    const { service, saved } = makeService({ existing: pending() });
    await service.approve('lr-1', 'emp-1');
    expect(saved[0].status).toBe(LeaveRequestStatus.APPROVED);
  });

  it('refuses to decide a request that is not pending', async () => {
    const { service } = makeService({
      existing: pending({ status: LeaveRequestStatus.APPROVED }),
    });
    await expect(service.approve('lr-1', 'user-2')).rejects.toThrow(
      /Cannot approve a request with status APPROVED/,
    );
  });

  it('records the reason on rejection', async () => {
    const { service, saved } = makeService({ existing: pending() });
    await service.reject('lr-1', 'user-2', 'Peak season');
    expect(saved[0].status).toBe(LeaveRequestStatus.REJECTED);
    expect(saved[0].rejectionReason).toBe('Peak season');
  });

  it('stops someone cancelling a request they did not submit', async () => {
    const { service } = makeService({ existing: pending() });
    await expect(service.cancel('lr-1', 'user-9')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('lets the submitter cancel their own request', async () => {
    const { service, saved } = makeService({ existing: pending() });
    await service.cancel('lr-1', 'user-1');
    expect(saved[0].status).toBe(LeaveRequestStatus.CANCELLED);
  });

  it('lets HR cancel anyone’s request', async () => {
    const { service, saved } = makeService({ existing: pending() });
    await service.cancel('lr-1', 'user-9', true);
    expect(saved[0].status).toBe(LeaveRequestStatus.CANCELLED);
  });
});
