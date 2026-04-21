// User & Auth Enums
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
}

// ============================================
// SUBSCRIPTION ENUMS (Master DB)
// ============================================
export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  TRIAL = 'TRIAL',
  PAST_DUE = 'PAST_DUE',
  SUSPENDED = 'SUSPENDED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export enum TenantStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
  DELETED = 'DELETED',
}

export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  SEMI_ANNUAL = 'SEMI_ANNUAL',
  ANNUAL = 'ANNUAL',
}

// ============================================
// PRODUCT ENUMS
// ============================================
export enum ProductType {
  GOODS = 'GOODS',
  SERVICE = 'SERVICE',
  COMBO = 'COMBO',
  DIGITAL = 'DIGITAL',
  RAW_MATERIAL = 'RAW_MATERIAL',
  SEMI_FINISHED = 'SEMI_FINISHED',
  FINISHED = 'FINISHED',
}

// ============================================
// UNIT OF MEASURE ENUMS
// ============================================
export enum UomType {
  COUNT = 'COUNT',
  UNIT = 'UNIT',
  WEIGHT = 'WEIGHT',
  VOLUME = 'VOLUME',
  LENGTH = 'LENGTH',
  AREA = 'AREA',
  TIME = 'TIME',
  PACK = 'PACK',
}

// ============================================
// WAREHOUSE ENUMS
// ============================================
export enum WarehouseType {
  MAIN = 'MAIN',
  DISTRIBUTION = 'DISTRIBUTION',
  RAW_MATERIAL = 'RAW_MATERIAL',
  RETAIL = 'RETAIL',
  VIRTUAL = 'VIRTUAL',
  TRANSIT = 'TRANSIT',
  QUARANTINE = 'QUARANTINE',
  RETURNS = 'RETURNS',
}

export enum ZoneType {
  STAGING = 'STAGING',
  PACKING = 'PACKING',
  STORAGE = 'STORAGE',
  GENERAL = 'GENERAL',
  COLD_STORAGE = 'COLD_STORAGE',
  HAZARDOUS = 'HAZARDOUS',
  HIGH_VALUE = 'HIGH_VALUE',
  BULK = 'BULK',
  PICKING = 'PICKING',
  RECEIVING = 'RECEIVING',
  SHIPPING = 'SHIPPING',
  QUARANTINE = 'QUARANTINE',
  RETURNS = 'RETURNS',
}

export enum LocationType {
  RECEIVING = 'RECEIVING',
  STORAGE = 'STORAGE',
  PICKING = 'PICKING',
  PACKING = 'PACKING',
  SHIPPING = 'SHIPPING',
  STAGING = 'STAGING',
  QUALITY_CHECK = 'QUALITY_CHECK',
  RETURNS = 'RETURNS',
  DAMAGE = 'DAMAGE',
  BULk = 'BULk',
}

export enum LocationStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  BLOCKED = 'BLOCKED',
  MAINTENANCE = 'MAINTENANCE',
}

// ============================================
// STOCK MOVEMENT ENUMS
// ============================================
export enum StockMovementType {
  PURCHASE_RECEIPT = 'PURCHASE_RECEIPT',
  SALES_ISSUE = 'SALES_ISSUE',
  TRANSFER_IN = 'TRANSFER_IN',
  TRANSFER_OUT = 'TRANSFER_OUT',
  ADJUSTMENT_IN = 'ADJUSTMENT_IN',
  ADJUSTMENT_OUT = 'ADJUSTMENT_OUT',
  RETURN_FROM_CUSTOMER = 'RETURN_FROM_CUSTOMER',
  RETURN_TO_SUPPLIER = 'RETURN_TO_SUPPLIER',
  PRODUCTION_ISSUE = 'PRODUCTION_ISSUE',
  PRODUCTION_RECEIPT = 'PRODUCTION_RECEIPT',
  OPENING_STOCK = 'OPENING_STOCK',
  WRITE_OFF = 'WRITE_OFF',
  DAMAGE = 'DAMAGE',
  EXPIRY = 'EXPIRY',
  SAMPLE = 'SAMPLE',
  INTER_LOCATION_IN = 'INTER_LOCATION_IN',
  INTER_LOCATION_OUT = 'INTER_LOCATION_OUT',
  SCRAP = 'SCRAP',
  OTHER = 'OTHER',
}

// ============================================
// ORDER STATUS ENUMS
// ============================================
export enum SalesOrderStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  READY_TO_SHIP = 'READY_TO_SHIP',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
  ON_HOLD = 'ON_HOLD',
}

export enum InventoryStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  DAMAGED = 'DAMAGED',
  QUARANTINE = 'QUARANTINE',
  ON_HOLD = 'ON_HOLD',
}

// Order Enums
// export enum OrderStatus {
//   DRAFT = 'DRAFT',
//   PENDING = 'PENDING',
//   CONFIRMED = 'CONFIRMED',
//   PROCESSING = 'PROCESSING',
//   READY_TO_SHIP = 'READY_TO_SHIP',
//   SHIPPED = 'SHIPPED',
//   PARTIALLY_DELIVERED = 'PARTIALLY_DELIVERED',
//   DELIVERED = 'DELIVERED',
//   COMPLETED = 'COMPLETED',
//   CANCELLED = 'CANCELLED',
//   REFUNDED = 'REFUNDED',
//   ON_HOLD = 'ON_HOLD',
// }

// ============================================
// PAYMENT ENUMS
// ============================================
export enum PaymentStatus {
  PENDING = 'PENDING',
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
}

export enum PaymentMethodType {
  CASH = 'CASH',
  CARD = 'CARD',
  UPI = 'UPI',
  NET_BANKING = 'NET_BANKING',
  WALLET = 'WALLET',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CHEQUE = 'CHEQUE',
  COD = 'COD',
  CREDIT = 'CREDIT',
  EMI = 'EMI',
  GIFT_CARD = 'GIFT_CARD',
  STORE_CREDIT = 'STORE_CREDIT',
  OTHER = 'OTHER',
}

export enum FulfillmentStatus {
  UNFULFILLED = 'UNFULFILLED',
  PARTIALLY_FULFILLED = 'PARTIALLY_FULFILLED',
  FULFILLED = 'FULFILLED',
  RETURNED = 'RETURNED',
}

export enum OrderSource {
  WEBSITE = 'WEBSITE',
  MOBILE_APP = 'MOBILE_APP',
  POS = 'POS',
  PHONE = 'PHONE',
  MANUAL = 'MANUAL',
  API = 'API',
}

export enum PurchaseOrderStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  SENT = 'SENT',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  PARTIALLY_RECEIVED = 'PARTIALLY_RECEIVED',
  RECEIVED = 'RECEIVED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  CLOSED = 'CLOSED',
}

export enum GRNStatus {
  DRAFT = 'DRAFT',
  PENDING_QC = 'PENDING_QC',
  QC_PASSED = 'QC_PASSED',
  QC_FAILED = 'QC_FAILED',
  PARTIALLY_ACCEPTED = 'PARTIALLY_ACCEPTED',
  ACCEPTED = 'ACCEPTED',
  CANCELLED = 'CANCELLED',
}

export enum BOMStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  OBSOLETE = 'OBSOLETE',
}

// ============================================
// CUSTOMER/SUPPLIER ENUMS
// ============================================
export enum CustomerType {
  INDIVIDUAL = 'INDIVIDUAL',
  BUSINESS = 'BUSINESS',
  WHOLESALE = 'WHOLESALE',
  RETAIL = 'RETAIL',
}

export enum AddressType {
  BILLING = 'BILLING',
  SHIPPING = 'SHIPPING',
  BOTH = 'BOTH',
}
// ============================================
// DUE STATUS ENUMS
// ============================================
export enum DueStatus {
  PENDING = 'PENDING',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
  WRITTEN_OFF = 'WRITTEN_OFF',
}

export enum NormalBalance {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

export enum JournalEntryType {
  MANUAL = 'MANUAL',
  SALES = 'SALES',
  PURCHASE = 'PURCHASE',
  RECEIPT = 'RECEIPT',
  PAYMENT = 'PAYMENT',
  INVENTORY = 'INVENTORY',
  MANUFACTURING = 'MANUFACTURING',
  ADJUSTMENT = 'ADJUSTMENT',
  OPENING = 'OPENING',
  CLOSING = 'CLOSING',
  REVERSAL = 'REVERSAL',
}

// ============================================
// ACCOUNTING ENUMS
// ============================================
export enum AccountType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE',
}

export enum JournalEntryStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  POSTED = 'POSTED',
  REVERSED = 'REVERSED',
  CANCELLED = 'CANCELLED',
}

export enum FiscalPeriodStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  LOCKED = 'LOCKED',
}

// ============================================
// MANUFACTURING ENUMS
// ============================================
export enum WorkOrderStatus {
  DRAFT = 'DRAFT',
  PLANNED = 'PLANNED',
  RELEASED = 'RELEASED',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  CLOSED = 'CLOSED',
}

export enum BomStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  OBSOLETE = 'OBSOLETE',
}

// ============================================
// POS ENUMS
// ============================================
export enum PosSessionStatus {
  OPEN = 'OPEN',
  CLOSING = 'CLOSING',
  CLOSED = 'CLOSED',
  RECONCILED = 'RECONCILED',
}

export enum PosTransactionType {
  SALE = 'SALE',
  RETURN = 'RETURN',
  EXCHANGE = 'EXCHANGE',
  VOID = 'VOID',
  LAYAWAY = 'LAYAWAY',
}

// Priority Enums
export enum Priority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

// ============================================
// IMPORT/EXPORT ENUMS
// ============================================
export enum ImportJobStatus {
  PENDING = 'PENDING',
  VALIDATING = 'VALIDATING',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  VALIDATED = 'VALIDATED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  COMPLETED_WITH_ERRORS = 'COMPLETED_WITH_ERRORS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}
export enum ImportMode {
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  UPSERT = 'UPSERT',
}

export enum ExportJobStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export enum FileFormat {
  XLSX = 'XLSX',
  CSV = 'CSV',
  PDF = 'PDF',
  JSON = 'JSON',
}

// ============================================
// HR ENUMS
// ============================================
export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERN = 'INTERN',
  CONSULTANT = 'CONSULTANT',
}

export enum EmploymentStatus {
  ACTIVE = 'ACTIVE',
  PROBATION = 'PROBATION',
  NOTICE_PERIOD = 'NOTICE_PERIOD',
  RESIGNED = 'RESIGNED',
  TERMINATED = 'TERMINATED',
  ON_LEAVE = 'ON_LEAVE',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum MaritalStatus {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWED = 'WIDOWED',
}

export enum SalaryBasis {
  MONTHLY = 'MONTHLY',
  DAILY = 'DAILY',
  HOURLY = 'HOURLY',
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  HALF_DAY = 'HALF_DAY',
  HOLIDAY = 'HOLIDAY',
  LEAVE = 'LEAVE',
}

export enum LeaveRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export enum HrPayrollStatus {
  DRAFT = 'DRAFT',
  PROCESSING = 'PROCESSING',
  APPROVED = 'APPROVED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export enum PayrollComponentType {
  EARNING = 'EARNING',
  DEDUCTION = 'DEDUCTION',
}
