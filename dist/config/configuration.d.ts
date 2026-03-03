export declare const configuration: () => {
    port: number;
    nodeEnv: string;
    jwt: {
        secret: string;
        expiresIn: string;
        refreshExpiresIn: string;
    };
    masterDb: {
        type: "mysql";
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
    };
    tenantDb: {
        host: string;
        port: number;
        username: string;
        password: string;
    };
    redis: {
        host: string;
        port: number;
        password: string | undefined;
    };
    email: {
        host: string;
        port: number;
        user: string;
        password: string;
        from: string;
    };
    storage: {
        type: string;
        localPath: string;
        s3: {
            bucket: string;
            region: string;
            accessKeyId: string;
            secretAccessKey: string;
        };
    };
    logging: {
        level: string;
        format: string;
    };
    cors: {
        origin: string;
    };
};
