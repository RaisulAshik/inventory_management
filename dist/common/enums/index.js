"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileFormat = exports.ExportJobStatus = exports.ImportMode = exports.ImportJobStatus = exports.Priority = exports.PosTransactionType = exports.PosSessionStatus = exports.BomStatus = exports.WorkOrderStatus = exports.FiscalPeriodStatus = exports.JournalEntryStatus = exports.AccountType = exports.JournalEntryType = exports.NormalBalance = exports.DueStatus = exports.AddressType = exports.CustomerType = exports.BOMStatus = exports.GRNStatus = exports.PurchaseOrderStatus = exports.OrderSource = exports.FulfillmentStatus = exports.PaymentMethodType = exports.PaymentStatus = exports.InventoryStatus = exports.SalesOrderStatus = exports.StockMovementType = exports.LocationStatus = exports.LocationType = exports.ZoneType = exports.WarehouseType = exports.UomType = exports.ProductType = exports.BillingCycle = exports.TenantStatus = exports.SubscriptionStatus = exports.UserStatus = void 0;
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "ACTIVE";
    UserStatus["INACTIVE"] = "INACTIVE";
    UserStatus["SUSPENDED"] = "SUSPENDED";
    UserStatus["PENDING"] = "PENDING";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["ACTIVE"] = "ACTIVE";
    SubscriptionStatus["TRIAL"] = "TRIAL";
    SubscriptionStatus["PAST_DUE"] = "PAST_DUE";
    SubscriptionStatus["SUSPENDED"] = "SUSPENDED";
    SubscriptionStatus["CANCELLED"] = "CANCELLED";
    SubscriptionStatus["EXPIRED"] = "EXPIRED";
})(SubscriptionStatus || (exports.SubscriptionStatus = SubscriptionStatus = {}));
var TenantStatus;
(function (TenantStatus) {
    TenantStatus["ACTIVE"] = "ACTIVE";
    TenantStatus["INACTIVE"] = "INACTIVE";
    TenantStatus["SUSPENDED"] = "SUSPENDED";
    TenantStatus["PENDING"] = "PENDING";
    TenantStatus["DELETED"] = "DELETED";
})(TenantStatus || (exports.TenantStatus = TenantStatus = {}));
var BillingCycle;
(function (BillingCycle) {
    BillingCycle["MONTHLY"] = "MONTHLY";
    BillingCycle["QUARTERLY"] = "QUARTERLY";
    BillingCycle["SEMI_ANNUAL"] = "SEMI_ANNUAL";
    BillingCycle["ANNUAL"] = "ANNUAL";
})(BillingCycle || (exports.BillingCycle = BillingCycle = {}));
var ProductType;
(function (ProductType) {
    ProductType["GOODS"] = "GOODS";
    ProductType["SERVICE"] = "SERVICE";
    ProductType["COMBO"] = "COMBO";
    ProductType["DIGITAL"] = "DIGITAL";
    ProductType["RAW_MATERIAL"] = "RAW_MATERIAL";
    ProductType["SEMI_FINISHED"] = "SEMI_FINISHED";
    ProductType["FINISHED"] = "FINISHED";
})(ProductType || (exports.ProductType = ProductType = {}));
var UomType;
(function (UomType) {
    UomType["COUNT"] = "COUNT";
    UomType["UNIT"] = "UNIT";
    UomType["WEIGHT"] = "WEIGHT";
    UomType["VOLUME"] = "VOLUME";
    UomType["LENGTH"] = "LENGTH";
    UomType["AREA"] = "AREA";
    UomType["TIME"] = "TIME";
    UomType["PACK"] = "PACK";
})(UomType || (exports.UomType = UomType = {}));
var WarehouseType;
(function (WarehouseType) {
    WarehouseType["MAIN"] = "MAIN";
    WarehouseType["DISTRIBUTION"] = "DISTRIBUTION";
    WarehouseType["RAW_MATERIAL"] = "RAW_MATERIAL";
    WarehouseType["RETAIL"] = "RETAIL";
    WarehouseType["VIRTUAL"] = "VIRTUAL";
    WarehouseType["TRANSIT"] = "TRANSIT";
    WarehouseType["QUARANTINE"] = "QUARANTINE";
    WarehouseType["RETURNS"] = "RETURNS";
})(WarehouseType || (exports.WarehouseType = WarehouseType = {}));
var ZoneType;
(function (ZoneType) {
    ZoneType["STAGING"] = "STAGING";
    ZoneType["PACKING"] = "PACKING";
    ZoneType["STORAGE"] = "STORAGE";
    ZoneType["GENERAL"] = "GENERAL";
    ZoneType["COLD_STORAGE"] = "COLD_STORAGE";
    ZoneType["HAZARDOUS"] = "HAZARDOUS";
    ZoneType["HIGH_VALUE"] = "HIGH_VALUE";
    ZoneType["BULK"] = "BULK";
    ZoneType["PICKING"] = "PICKING";
    ZoneType["RECEIVING"] = "RECEIVING";
    ZoneType["SHIPPING"] = "SHIPPING";
    ZoneType["QUARANTINE"] = "QUARANTINE";
    ZoneType["RETURNS"] = "RETURNS";
})(ZoneType || (exports.ZoneType = ZoneType = {}));
var LocationType;
(function (LocationType) {
    LocationType["RECEIVING"] = "RECEIVING";
    LocationType["STORAGE"] = "STORAGE";
    LocationType["PICKING"] = "PICKING";
    LocationType["PACKING"] = "PACKING";
    LocationType["SHIPPING"] = "SHIPPING";
    LocationType["STAGING"] = "STAGING";
    LocationType["QUALITY_CHECK"] = "QUALITY_CHECK";
    LocationType["RETURNS"] = "RETURNS";
    LocationType["DAMAGE"] = "DAMAGE";
    LocationType["BULk"] = "BULk";
})(LocationType || (exports.LocationType = LocationType = {}));
var LocationStatus;
(function (LocationStatus) {
    LocationStatus["AVAILABLE"] = "AVAILABLE";
    LocationStatus["OCCUPIED"] = "OCCUPIED";
    LocationStatus["RESERVED"] = "RESERVED";
    LocationStatus["BLOCKED"] = "BLOCKED";
    LocationStatus["MAINTENANCE"] = "MAINTENANCE";
})(LocationStatus || (exports.LocationStatus = LocationStatus = {}));
var StockMovementType;
(function (StockMovementType) {
    StockMovementType["SCRAP"] = "SCRAP";
    StockMovementType["PRODUCTION_RECEIPT"] = "PRODUCTION_RECEIPT";
    StockMovementType["PRODUCTION_ISSUE"] = "PRODUCTION_ISSUE";
    StockMovementType["RETURN_IN"] = "RETURN_IN";
    StockMovementType["RETURN_OUT"] = "RETURN_OUT";
    StockMovementType["PURCHASE_RECEIPT"] = "PURCHASE_RECEIPT";
    StockMovementType["PURCHASE_RETURN"] = "PURCHASE_RETURN";
    StockMovementType["SALES"] = "SALES";
    StockMovementType["SALES_RETURN"] = "SALES_RETURN";
    StockMovementType["TRANSFER_IN"] = "TRANSFER_IN";
    StockMovementType["TRANSFER_OUT"] = "TRANSFER_OUT";
    StockMovementType["ADJUSTMENT_IN"] = "ADJUSTMENT_IN";
    StockMovementType["ADJUSTMENT_OUT"] = "ADJUSTMENT_OUT";
    StockMovementType["PRODUCTION_CONSUMPTION"] = "PRODUCTION_CONSUMPTION";
    StockMovementType["PRODUCTION_OUTPUT"] = "PRODUCTION_OUTPUT";
    StockMovementType["WRITE_OFF"] = "WRITE_OFF";
    StockMovementType["DAMAGE"] = "DAMAGE";
    StockMovementType["OPENING_STOCK"] = "OPENING_STOCK";
})(StockMovementType || (exports.StockMovementType = StockMovementType = {}));
var SalesOrderStatus;
(function (SalesOrderStatus) {
    SalesOrderStatus["DRAFT"] = "DRAFT";
    SalesOrderStatus["PENDING"] = "PENDING";
    SalesOrderStatus["CONFIRMED"] = "CONFIRMED";
    SalesOrderStatus["PROCESSING"] = "PROCESSING";
    SalesOrderStatus["READY_TO_SHIP"] = "READY_TO_SHIP";
    SalesOrderStatus["SHIPPED"] = "SHIPPED";
    SalesOrderStatus["DELIVERED"] = "DELIVERED";
    SalesOrderStatus["COMPLETED"] = "COMPLETED";
    SalesOrderStatus["CANCELLED"] = "CANCELLED";
    SalesOrderStatus["RETURNED"] = "RETURNED";
    SalesOrderStatus["ON_HOLD"] = "ON_HOLD";
})(SalesOrderStatus || (exports.SalesOrderStatus = SalesOrderStatus = {}));
var InventoryStatus;
(function (InventoryStatus) {
    InventoryStatus["AVAILABLE"] = "AVAILABLE";
    InventoryStatus["RESERVED"] = "RESERVED";
    InventoryStatus["DAMAGED"] = "DAMAGED";
    InventoryStatus["QUARANTINE"] = "QUARANTINE";
    InventoryStatus["ON_HOLD"] = "ON_HOLD";
})(InventoryStatus || (exports.InventoryStatus = InventoryStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["UNPAID"] = "UNPAID";
    PaymentStatus["PAID"] = "PAID";
    PaymentStatus["PARTIALLY_PAID"] = "PARTIALLY_PAID";
    PaymentStatus["PROCESSING"] = "PROCESSING";
    PaymentStatus["COMPLETED"] = "COMPLETED";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["CANCELLED"] = "CANCELLED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
    PaymentStatus["PARTIALLY_REFUNDED"] = "PARTIALLY_REFUNDED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var PaymentMethodType;
(function (PaymentMethodType) {
    PaymentMethodType["CASH"] = "CASH";
    PaymentMethodType["CARD"] = "CARD";
    PaymentMethodType["UPI"] = "UPI";
    PaymentMethodType["NET_BANKING"] = "NET_BANKING";
    PaymentMethodType["WALLET"] = "WALLET";
    PaymentMethodType["BANK_TRANSFER"] = "BANK_TRANSFER";
    PaymentMethodType["CHEQUE"] = "CHEQUE";
    PaymentMethodType["COD"] = "COD";
    PaymentMethodType["CREDIT"] = "CREDIT";
    PaymentMethodType["EMI"] = "EMI";
    PaymentMethodType["GIFT_CARD"] = "GIFT_CARD";
    PaymentMethodType["STORE_CREDIT"] = "STORE_CREDIT";
    PaymentMethodType["OTHER"] = "OTHER";
})(PaymentMethodType || (exports.PaymentMethodType = PaymentMethodType = {}));
var FulfillmentStatus;
(function (FulfillmentStatus) {
    FulfillmentStatus["UNFULFILLED"] = "UNFULFILLED";
    FulfillmentStatus["PARTIALLY_FULFILLED"] = "PARTIALLY_FULFILLED";
    FulfillmentStatus["FULFILLED"] = "FULFILLED";
    FulfillmentStatus["RETURNED"] = "RETURNED";
})(FulfillmentStatus || (exports.FulfillmentStatus = FulfillmentStatus = {}));
var OrderSource;
(function (OrderSource) {
    OrderSource["WEBSITE"] = "WEBSITE";
    OrderSource["MOBILE_APP"] = "MOBILE_APP";
    OrderSource["POS"] = "POS";
    OrderSource["PHONE"] = "PHONE";
    OrderSource["MANUAL"] = "MANUAL";
    OrderSource["API"] = "API";
})(OrderSource || (exports.OrderSource = OrderSource = {}));
var PurchaseOrderStatus;
(function (PurchaseOrderStatus) {
    PurchaseOrderStatus["DRAFT"] = "DRAFT";
    PurchaseOrderStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    PurchaseOrderStatus["APPROVED"] = "APPROVED";
    PurchaseOrderStatus["SENT"] = "SENT";
    PurchaseOrderStatus["ACKNOWLEDGED"] = "ACKNOWLEDGED";
    PurchaseOrderStatus["PARTIALLY_RECEIVED"] = "PARTIALLY_RECEIVED";
    PurchaseOrderStatus["RECEIVED"] = "RECEIVED";
    PurchaseOrderStatus["COMPLETED"] = "COMPLETED";
    PurchaseOrderStatus["CANCELLED"] = "CANCELLED";
    PurchaseOrderStatus["CLOSED"] = "CLOSED";
})(PurchaseOrderStatus || (exports.PurchaseOrderStatus = PurchaseOrderStatus = {}));
var GRNStatus;
(function (GRNStatus) {
    GRNStatus["DRAFT"] = "DRAFT";
    GRNStatus["PENDING_QC"] = "PENDING_QC";
    GRNStatus["QC_PASSED"] = "QC_PASSED";
    GRNStatus["QC_FAILED"] = "QC_FAILED";
    GRNStatus["PARTIALLY_ACCEPTED"] = "PARTIALLY_ACCEPTED";
    GRNStatus["ACCEPTED"] = "ACCEPTED";
    GRNStatus["CANCELLED"] = "CANCELLED";
})(GRNStatus || (exports.GRNStatus = GRNStatus = {}));
var BOMStatus;
(function (BOMStatus) {
    BOMStatus["DRAFT"] = "DRAFT";
    BOMStatus["ACTIVE"] = "ACTIVE";
    BOMStatus["OBSOLETE"] = "OBSOLETE";
})(BOMStatus || (exports.BOMStatus = BOMStatus = {}));
var CustomerType;
(function (CustomerType) {
    CustomerType["INDIVIDUAL"] = "INDIVIDUAL";
    CustomerType["BUSINESS"] = "BUSINESS";
    CustomerType["WHOLESALE"] = "WHOLESALE";
    CustomerType["RETAIL"] = "RETAIL";
})(CustomerType || (exports.CustomerType = CustomerType = {}));
var AddressType;
(function (AddressType) {
    AddressType["BILLING"] = "BILLING";
    AddressType["SHIPPING"] = "SHIPPING";
    AddressType["BOTH"] = "BOTH";
})(AddressType || (exports.AddressType = AddressType = {}));
var DueStatus;
(function (DueStatus) {
    DueStatus["PENDING"] = "PENDING";
    DueStatus["PARTIALLY_PAID"] = "PARTIALLY_PAID";
    DueStatus["PAID"] = "PAID";
    DueStatus["OVERDUE"] = "OVERDUE";
    DueStatus["CANCELLED"] = "CANCELLED";
    DueStatus["WRITTEN_OFF"] = "WRITTEN_OFF";
})(DueStatus || (exports.DueStatus = DueStatus = {}));
var NormalBalance;
(function (NormalBalance) {
    NormalBalance["DEBIT"] = "DEBIT";
    NormalBalance["CREDIT"] = "CREDIT";
})(NormalBalance || (exports.NormalBalance = NormalBalance = {}));
var JournalEntryType;
(function (JournalEntryType) {
    JournalEntryType["MANUAL"] = "MANUAL";
    JournalEntryType["SALES"] = "SALES";
    JournalEntryType["PURCHASE"] = "PURCHASE";
    JournalEntryType["RECEIPT"] = "RECEIPT";
    JournalEntryType["PAYMENT"] = "PAYMENT";
    JournalEntryType["INVENTORY"] = "INVENTORY";
    JournalEntryType["MANUFACTURING"] = "MANUFACTURING";
    JournalEntryType["ADJUSTMENT"] = "ADJUSTMENT";
    JournalEntryType["OPENING"] = "OPENING";
    JournalEntryType["CLOSING"] = "CLOSING";
    JournalEntryType["REVERSAL"] = "REVERSAL";
})(JournalEntryType || (exports.JournalEntryType = JournalEntryType = {}));
var AccountType;
(function (AccountType) {
    AccountType["ASSET"] = "ASSET";
    AccountType["LIABILITY"] = "LIABILITY";
    AccountType["EQUITY"] = "EQUITY";
    AccountType["REVENUE"] = "REVENUE";
    AccountType["EXPENSE"] = "EXPENSE";
})(AccountType || (exports.AccountType = AccountType = {}));
var JournalEntryStatus;
(function (JournalEntryStatus) {
    JournalEntryStatus["DRAFT"] = "DRAFT";
    JournalEntryStatus["PENDING"] = "PENDING";
    JournalEntryStatus["POSTED"] = "POSTED";
    JournalEntryStatus["REVERSED"] = "REVERSED";
    JournalEntryStatus["CANCELLED"] = "CANCELLED";
})(JournalEntryStatus || (exports.JournalEntryStatus = JournalEntryStatus = {}));
var FiscalPeriodStatus;
(function (FiscalPeriodStatus) {
    FiscalPeriodStatus["OPEN"] = "OPEN";
    FiscalPeriodStatus["CLOSED"] = "CLOSED";
    FiscalPeriodStatus["LOCKED"] = "LOCKED";
})(FiscalPeriodStatus || (exports.FiscalPeriodStatus = FiscalPeriodStatus = {}));
var WorkOrderStatus;
(function (WorkOrderStatus) {
    WorkOrderStatus["DRAFT"] = "DRAFT";
    WorkOrderStatus["PLANNED"] = "PLANNED";
    WorkOrderStatus["RELEASED"] = "RELEASED";
    WorkOrderStatus["IN_PROGRESS"] = "IN_PROGRESS";
    WorkOrderStatus["ON_HOLD"] = "ON_HOLD";
    WorkOrderStatus["COMPLETED"] = "COMPLETED";
    WorkOrderStatus["CANCELLED"] = "CANCELLED";
    WorkOrderStatus["CLOSED"] = "CLOSED";
})(WorkOrderStatus || (exports.WorkOrderStatus = WorkOrderStatus = {}));
var BomStatus;
(function (BomStatus) {
    BomStatus["DRAFT"] = "DRAFT";
    BomStatus["ACTIVE"] = "ACTIVE";
    BomStatus["INACTIVE"] = "INACTIVE";
    BomStatus["OBSOLETE"] = "OBSOLETE";
})(BomStatus || (exports.BomStatus = BomStatus = {}));
var PosSessionStatus;
(function (PosSessionStatus) {
    PosSessionStatus["OPEN"] = "OPEN";
    PosSessionStatus["CLOSING"] = "CLOSING";
    PosSessionStatus["CLOSED"] = "CLOSED";
    PosSessionStatus["RECONCILED"] = "RECONCILED";
})(PosSessionStatus || (exports.PosSessionStatus = PosSessionStatus = {}));
var PosTransactionType;
(function (PosTransactionType) {
    PosTransactionType["SALE"] = "SALE";
    PosTransactionType["RETURN"] = "RETURN";
    PosTransactionType["EXCHANGE"] = "EXCHANGE";
    PosTransactionType["VOID"] = "VOID";
    PosTransactionType["LAYAWAY"] = "LAYAWAY";
})(PosTransactionType || (exports.PosTransactionType = PosTransactionType = {}));
var Priority;
(function (Priority) {
    Priority["LOW"] = "LOW";
    Priority["NORMAL"] = "NORMAL";
    Priority["HIGH"] = "HIGH";
    Priority["URGENT"] = "URGENT";
})(Priority || (exports.Priority = Priority = {}));
var ImportJobStatus;
(function (ImportJobStatus) {
    ImportJobStatus["PENDING"] = "PENDING";
    ImportJobStatus["VALIDATING"] = "VALIDATING";
    ImportJobStatus["VALIDATION_FAILED"] = "VALIDATION_FAILED";
    ImportJobStatus["VALIDATED"] = "VALIDATED";
    ImportJobStatus["PROCESSING"] = "PROCESSING";
    ImportJobStatus["COMPLETED"] = "COMPLETED";
    ImportJobStatus["COMPLETED_WITH_ERRORS"] = "COMPLETED_WITH_ERRORS";
    ImportJobStatus["FAILED"] = "FAILED";
    ImportJobStatus["CANCELLED"] = "CANCELLED";
})(ImportJobStatus || (exports.ImportJobStatus = ImportJobStatus = {}));
var ImportMode;
(function (ImportMode) {
    ImportMode["INSERT"] = "INSERT";
    ImportMode["UPDATE"] = "UPDATE";
    ImportMode["UPSERT"] = "UPSERT";
})(ImportMode || (exports.ImportMode = ImportMode = {}));
var ExportJobStatus;
(function (ExportJobStatus) {
    ExportJobStatus["PENDING"] = "PENDING";
    ExportJobStatus["PROCESSING"] = "PROCESSING";
    ExportJobStatus["COMPLETED"] = "COMPLETED";
    ExportJobStatus["FAILED"] = "FAILED";
    ExportJobStatus["CANCELLED"] = "CANCELLED";
    ExportJobStatus["EXPIRED"] = "EXPIRED";
})(ExportJobStatus || (exports.ExportJobStatus = ExportJobStatus = {}));
var FileFormat;
(function (FileFormat) {
    FileFormat["XLSX"] = "XLSX";
    FileFormat["CSV"] = "CSV";
    FileFormat["PDF"] = "PDF";
    FileFormat["JSON"] = "JSON";
})(FileFormat || (exports.FileFormat = FileFormat = {}));
//# sourceMappingURL=index.js.map