import { DataSource } from 'typeorm';
export declare function getNextSequence(dataSource: DataSource, sequenceType: string): Promise<string>;
