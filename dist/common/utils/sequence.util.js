"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextSequence = getNextSequence;
const sequence_number_entity_1 = require("../../entities/tenant/user/sequence-number.entity");
async function getNextSequence(dataSource, sequenceType) {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
        const sequenceRepo = queryRunner.manager.getRepository(sequence_number_entity_1.SequenceNumber);
        let sequence = await sequenceRepo.findOne({
            where: { sequenceType },
            lock: { mode: 'pessimistic_write' },
        });
        if (!sequence) {
            sequence = sequenceRepo.create({
                sequenceType,
                prefix: getDefaultPrefix(sequenceType),
                currentNumber: 0,
                paddingLength: 6,
                resetPeriod: sequence_number_entity_1.ResetPeriod.NEVER,
            });
        }
        const now = new Date();
        if (shouldReset(sequence, now)) {
            sequence.currentNumber = 0;
            sequence.lastResetAt = now;
        }
        sequence.currentNumber += 1;
        await sequenceRepo.save(sequence);
        await queryRunner.commitTransaction();
        const paddedNumber = String(sequence.currentNumber).padStart(sequence.paddingLength, '0');
        const datePart = getDatePart(sequence.resetPeriod, now);
        return `${sequence.prefix ?? ''}${datePart}${paddedNumber}${sequence.suffix ?? ''}`;
    }
    catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    }
    finally {
        await queryRunner.release();
    }
}
function getDefaultPrefix(sequenceType) {
    const prefixes = {
        SALES_ORDER: 'SO',
        PURCHASE_ORDER: 'PO',
        INVOICE: 'INV',
        GRN: 'GRN',
        WORK_ORDER: 'WO',
        TRANSFER: 'TR',
        ADJUSTMENT: 'ADJ',
        CUSTOMER: 'CUST',
        SUPPLIER: 'SUPP',
        PRODUCT: 'PRD',
    };
    return prefixes[sequenceType] ?? sequenceType.substring(0, 3).toUpperCase();
}
function shouldReset(sequence, now) {
    if (!sequence.lastResetAt || sequence.resetPeriod === sequence_number_entity_1.ResetPeriod.NEVER) {
        return false;
    }
    const lastReset = new Date(sequence.lastResetAt);
    switch (sequence.resetPeriod) {
        case sequence_number_entity_1.ResetPeriod.DAILY:
            return lastReset.toDateString() !== now.toDateString();
        case sequence_number_entity_1.ResetPeriod.MONTHLY:
            return (lastReset.getMonth() !== now.getMonth() ||
                lastReset.getFullYear() !== now.getFullYear());
        case sequence_number_entity_1.ResetPeriod.YEARLY:
            return lastReset.getFullYear() !== now.getFullYear();
        default:
            return false;
    }
}
function getDatePart(resetPeriod, now) {
    const year = now.getFullYear().toString().slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    switch (resetPeriod) {
        case sequence_number_entity_1.ResetPeriod.DAILY:
            return `${year}${month}${day}`;
        case sequence_number_entity_1.ResetPeriod.MONTHLY:
            return `${year}${month}`;
        case sequence_number_entity_1.ResetPeriod.YEARLY:
            return year;
        default:
            return '';
    }
}
//# sourceMappingURL=sequence.util.js.map