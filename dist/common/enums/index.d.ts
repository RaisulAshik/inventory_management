export declare enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    SUSPENDED = "SUSPENDED",
    PENDING = "PENDING"
}
export declare enum SubscriptionStatus {
    ACTIVE = "ACTIVE",
    TRIAL = "TRIAL",
    PAST_DUE = "PAST_DUE",
    SUSPENDED = "SUSPENDED",
    CANCELLED = "CANCELLED",
    EXPIRED = "EXPIRED"
}
export declare enum TenantStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    SUSPENDED = "SUSPENDED",
    PENDING = "PENDING",
    DELETED = "DELETED"
}
export declare enum BillingCycle {
    MONTHLY = "MONTHLY",
    QUARTERLY = "QUARTERLY",
    SEMI_ANNUAL = "SEMI_ANNUAL",
    ANNUAL = "ANNUAL"
}
export declare enum ProductType {
    GOODS = "GOODS",
    SERVICE = "SERVICE",
    COMBO = "COMBO",
    DIGITAL = "DIGITAL",
    RAW_MATERIAL = "RAW_MATERIAL",
    SEMI_FINISHED = "SEMI_FINISHED",
    FINISHED = "FINISHED"
}
export declare enum UomType {
    COUNT = "COUNT",
    UNIT = "UNIT",
    WEIGHT = "WEIGHT",
    VOLUME = "VOLUME",
    LENGTH = "LENGTH",
    AREA = "AREA",
    TIME = "TIME",
    PACK = "PACK"
}
export declare enum WarehouseType {
    MAIN = "MAIN",
    DISTRIBUTION = "DISTRIBUTION",
    RAW_MATERIAL = "RAW_MATERIAL",
    RETAIL = "RETAIL",
    VIRTUAL = "VIRTUAL",
    TRANSIT = "TRANSIT",
    QUARANTINE = "QUARANTINE",
    RETURNS = "RETURNS"
}
export declare enum ZoneType {
    STAGING = "STAGING",
    PACKING = "PACKING",
    STORAGE = "STORAGE",
    GENERAL = "GENERAL",
    COLD_STORAGE = "COLD_STORAGE",
    HAZARDOUS = "HAZARDOUS",
    HIGH_VALUE = "HIGH_VALUE",
    BULK = "BULK",
    PICKING = "PICKING",
    RECEIVING = "RECEIVING",
    SHIPPING = "SHIPPING",
    QUARANTINE = "QUARANTINE",
    RETURNS = "RETURNS"
}
export declare enum LocationType {
    RECEIVING = "RECEIVING",
    STORAGE = "STORAGE",
    PICKING = "PICKING",
    PACKING = "PACKING",
    SHIPPING = "SHIPPING",
    STAGING = "STAGING",
    QUALITY_CHECK = "QUALITY_CHECK",
    RETURNS = "RETURNS",
    DAMAGE = "DAMAGE",
    BULk = "BULk"
}
export declare enum LocationStatus {
    AVAILABLE = "AVAILABLE",
    OCCUPIED = "OCCUPIED",
    RESERVED = "RESERVED",
    BLOCKED = "BLOCKED",
    MAINTENANCE = "MAINTENANCE"
}
export declare enum StockMovementType {
    SCRAP = "SCRAP",
    PRODUCTION_RECEIPT = "PRODUCTION_RECEIPT",
    PRODUCTION_ISSUE = "PRODUCTION_ISSUE",
    RETURN_IN = "RETURN_IN",
    RETURN_OUT = "RETURN_OUT",
    PURCHASE_RECEIPT = "PURCHASE_RECEIPT",
    PURCHASE_RETURN = "PURCHASE_RETURN",
    SALES = "SALES",
    SALES_RETURN = "SALES_RETURN",
    TRANSFER_IN = "TRANSFER_IN",
    TRANSFER_OUT = "TRANSFER_OUT",
    ADJUSTMENT_IN = "ADJUSTMENT_IN",
    ADJUSTMENT_OUT = "ADJUSTMENT_OUT",
    PRODUCTION_CONSUMPTION = "PRODUCTION_CONSUMPTION",
    PRODUCTION_OUTPUT = "PRODUCTION_OUTPUT",
    WRITE_OFF = "WRITE_OFF",
    DAMAGE = "DAMAGE",
    OPENING_STOCK = "OPENING_STOCK"
}
export declare enum SalesOrderStatus {
    DRAFT = "DRAFT",
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    PROCESSING = "PROCESSING",
    READY_TO_SHIP = "READY_TO_SHIP",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    RETURNED = "RETURNED",
    ON_HOLD = "ON_HOLD"
}
export declare enum InventoryStatus {
    AVAILABLE = "AVAILABLE",
    RESERVED = "RESERVED",
    DAMAGED = "DAMAGED",
    QUARANTINE = "QUARANTINE",
    ON_HOLD = "ON_HOLD"
}
export declare enum PaymentStatus {
    PENDING = "PENDING",
    UNPAID = "UNPAID",
    PAID = "PAID",
    PARTIALLY_PAID = "PARTIALLY_PAID",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
    REFUNDED = "REFUNDED",
    PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED"
}
export declare enum PaymentMethodType {
    CASH = "CASH",
    CARD = "CARD",
    UPI = "UPI",
    NET_BANKING = "NET_BANKING",
    WALLET = "WALLET",
    BANK_TRANSFER = "BANK_TRANSFER",
    CHEQUE = "CHEQUE",
    COD = "COD",
    CREDIT = "CREDIT",
    EMI = "EMI",
    GIFT_CARD = "GIFT_CARD",
    STORE_CREDIT = "STORE_CREDIT",
    OTHER = "OTHER"
}
export declare enum FulfillmentStatus {
    UNFULFILLED = "UNFULFILLED",
    PARTIALLY_FULFILLED = "PARTIALLY_FULFILLED",
    FULFILLED = "FULFILLED",
    RETURNED = "RETURNED"
}
export declare enum OrderSource {
    WEBSITE = "WEBSITE",
    MOBILE_APP = "MOBILE_APP",
    POS = "POS",
    PHONE = "PHONE",
    MANUAL = "MANUAL",
    API = "API"
}
export declare enum PurchaseOrderStatus {
    DRAFT = "DRAFT",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    SENT = "SENT",
    ACKNOWLEDGED = "ACKNOWLEDGED",
    PARTIALLY_RECEIVED = "PARTIALLY_RECEIVED",
    RECEIVED = "RECEIVED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    CLOSED = "CLOSED"
}
export declare enum GRNStatus {
    DRAFT = "DRAFT",
    PENDING_QC = "PENDING_QC",
    QC_PASSED = "QC_PASSED",
    QC_FAILED = "QC_FAILED",
    PARTIALLY_ACCEPTED = "PARTIALLY_ACCEPTED",
    ACCEPTED = "ACCEPTED",
    CANCELLED = "CANCELLED"
}
export declare enum BOMStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    OBSOLETE = "OBSOLETE"
}
export declare enum CustomerType {
    INDIVIDUAL = "INDIVIDUAL",
    BUSINESS = "BUSINESS",
    WHOLESALE = "WHOLESALE",
    RETAIL = "RETAIL"
}
export declare enum AddressType {
    BILLING = "BILLING",
    SHIPPING = "SHIPPING",
    BOTH = "BOTH"
}
export declare enum DueStatus {
    PENDING = "PENDING",
    PARTIALLY_PAID = "PARTIALLY_PAID",
    PAID = "PAID",
    OVERDUE = "OVERDUE",
    CANCELLED = "CANCELLED",
    WRITTEN_OFF = "WRITTEN_OFF"
}
export declare enum NormalBalance {
    DEBIT = "DEBIT",
    CREDIT = "CREDIT"
}
export declare enum JournalEntryType {
    MANUAL = "MANUAL",
    SALES = "SALES",
    PURCHASE = "PURCHASE",
    RECEIPT = "RECEIPT",
    PAYMENT = "PAYMENT",
    INVENTORY = "INVENTORY",
    MANUFACTURING = "MANUFACTURING",
    ADJUSTMENT = "ADJUSTMENT",
    OPENING = "OPENING",
    CLOSING = "CLOSING",
    REVERSAL = "REVERSAL"
}
export declare enum AccountType {
    ASSET = "ASSET",
    LIABILITY = "LIABILITY",
    EQUITY = "EQUITY",
    REVENUE = "REVENUE",
    EXPENSE = "EXPENSE"
}
export declare enum JournalEntryStatus {
    DRAFT = "DRAFT",
    PENDING = "PENDING",
    POSTED = "POSTED",
    REVERSED = "REVERSED",
    CANCELLED = "CANCELLED"
}
export declare enum FiscalPeriodStatus {
    OPEN = "OPEN",
    CLOSED = "CLOSED",
    LOCKED = "LOCKED"
}
export declare enum WorkOrderStatus {
    DRAFT = "DRAFT",
    PLANNED = "PLANNED",
    RELEASED = "RELEASED",
    IN_PROGRESS = "IN_PROGRESS",
    ON_HOLD = "ON_HOLD",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    CLOSED = "CLOSED"
}
export declare enum BomStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    OBSOLETE = "OBSOLETE"
}
export declare enum PosSessionStatus {
    OPEN = "OPEN",
    CLOSING = "CLOSING",
    CLOSED = "CLOSED",
    RECONCILED = "RECONCILED"
}
export declare enum PosTransactionType {
    SALE = "SALE",
    RETURN = "RETURN",
    EXCHANGE = "EXCHANGE",
    VOID = "VOID",
    LAYAWAY = "LAYAWAY"
}
export declare enum Priority {
    LOW = "LOW",
    NORMAL = "NORMAL",
    HIGH = "HIGH",
    URGENT = "URGENT"
}
export declare enum ImportJobStatus {
    PENDING = "PENDING",
    VALIDATING = "VALIDATING",
    VALIDATION_FAILED = "VALIDATION_FAILED",
    VALIDATED = "VALIDATED",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    COMPLETED_WITH_ERRORS = "COMPLETED_WITH_ERRORS",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED"
}
export declare enum ImportMode {
    INSERT = "INSERT",
    UPDATE = "UPDATE",
    UPSERT = "UPSERT"
}
export declare enum ExportJobStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
    EXPIRED = "EXPIRED"
}
export declare enum FileFormat {
    XLSX = "XLSX",
    CSV = "CSV",
    PDF = "PDF",
    JSON = "JSON"
}
