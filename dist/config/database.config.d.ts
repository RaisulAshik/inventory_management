declare const _default: (() => {
    master: {
        type: string;
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
        synchronize: boolean;
        logging: boolean;
    };
    tenant: {
        type: string;
        host: string;
        port: number;
        username: string;
        password: string;
        synchronize: boolean;
        logging: boolean;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    master: {
        type: string;
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
        synchronize: boolean;
        logging: boolean;
    };
    tenant: {
        type: string;
        host: string;
        port: number;
        username: string;
        password: string;
        synchronize: boolean;
        logging: boolean;
    };
}>;
export default _default;
