"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TenantConnectionManager_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantConnectionManager = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("typeorm");
const TenantEntities = __importStar(require("../entities/tenant"));
let TenantConnectionManager = class TenantConnectionManager {
    static { TenantConnectionManager_1 = this; }
    request;
    configService;
    static connectionPool = new Map();
    currentDataSource = null;
    constructor(request, configService) {
        this.request = request;
        this.configService = configService;
    }
    async onModuleDestroy() {
    }
    async getDataSource() {
        if (this.currentDataSource?.isInitialized) {
            return this.currentDataSource;
        }
        const tenantDatabase = this.request.tenantDatabase;
        if (!tenantDatabase) {
            throw new Error('Tenant database not set in request context');
        }
        if (TenantConnectionManager_1.connectionPool.has(tenantDatabase)) {
            const existingConnection = TenantConnectionManager_1.connectionPool.get(tenantDatabase);
            if (existingConnection?.isInitialized) {
                this.currentDataSource = existingConnection;
                return existingConnection;
            }
        }
        const dataSource = new typeorm_1.DataSource({
            type: 'mysql',
            host: this.configService.get('TENANT_DB_HOST', 'localhost'),
            port: this.configService.get('TENANT_DB_PORT', 3306),
            username: this.configService.get('TENANT_DB_USERNAME', 'root'),
            password: this.configService.get('TENANT_DB_PASSWORD', ''),
            database: tenantDatabase,
            entities: Object.values(TenantEntities).filter((entity) => typeof entity === 'function'),
            synchronize: false,
            logging: this.configService.get('NODE_ENV') === 'development',
            timezone: '+05:30',
            charset: 'utf8mb4',
            extra: {
                connectionLimit: 5,
            },
        });
        await dataSource.initialize();
        TenantConnectionManager_1.connectionPool.set(tenantDatabase, dataSource);
        this.currentDataSource = dataSource;
        return dataSource;
    }
    async getRepository(entity) {
        const dataSource = await this.getDataSource();
        return dataSource.getRepository(entity);
    }
    getTenantId() {
        return this.request.tenantId;
    }
    getTenantDatabase() {
        return this.request.tenantDatabase;
    }
    static async closeConnection(databaseName) {
        const connection = TenantConnectionManager_1.connectionPool.get(databaseName);
        if (connection?.isInitialized) {
            await connection.destroy();
            TenantConnectionManager_1.connectionPool.delete(databaseName);
        }
    }
    static async closeAllConnections() {
        for (const [, connection] of TenantConnectionManager_1.connectionPool) {
            if (connection.isInitialized) {
                await connection.destroy();
            }
        }
        TenantConnectionManager_1.connectionPool.clear();
    }
    static getPoolStats() {
        return {
            totalConnections: TenantConnectionManager_1.connectionPool.size,
            databases: Array.from(TenantConnectionManager_1.connectionPool.keys()),
        };
    }
};
exports.TenantConnectionManager = TenantConnectionManager;
exports.TenantConnectionManager = TenantConnectionManager = TenantConnectionManager_1 = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [Object, config_1.ConfigService])
], TenantConnectionManager);
//# sourceMappingURL=tenant-connection.manager.js.map