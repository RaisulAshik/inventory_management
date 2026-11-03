import { UsersController } from './users.controller';

/**
 * The user list's Edit opens the employee record, so each row must reach the
 * client with its `employeeId`. The list goes through UserResponseDto, which
 * copies fields one by one; this pins that the id survives that copy.
 */
describe('UsersController.findAll', () => {
  const user = (id: string, employeeId: string | null) =>
    ({
      id,
      email: `${id}@example.com`,
      firstName: id,
      isActive: true,
      employeeId,
    }) as any;

  it('passes each row’s employeeId through to the response', async () => {
    const controller = new UsersController({
      findAll: jest.fn().mockResolvedValue({
        data: [user('linked', 'emp-1'), user('unlinked', null)],
        meta: {},
      }),
    } as any);

    const result = await controller.findAll({} as any);
    const json = JSON.parse(JSON.stringify(result.data));

    expect(json[0].employeeId).toBe('emp-1');
    // null, not missing: the client tells "no record yet" from "not loaded".
    expect(json[1]).toHaveProperty('employeeId', null);
  });
});
