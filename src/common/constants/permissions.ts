// src/common/constants/permissions.ts
//
// The single source of truth for the tenant permission catalogue.
// Imported by the tenant provisioning service (new tenants), the seed
// migration (existing tenants) and the startup assertion that every
// @Permissions() string in the codebase resolves to a real code.
//
// Adding a route guarded by a new code? Add the code here too, or the
// application will refuse to boot.

export interface PermissionDef {
  /** Stable identifier checked by @Permissions(). */
  code: string;
  /** Human label shown in the role-editor UI. */
  name: string;
  /** Grouping key for the permission catalogue screen. */
  module: string;
}

export const PERMISSIONS: readonly PermissionDef[] = [
  // accounting
  {
    code: 'accounting.bank-accounts.create',
    name: 'Create Bank Accounts',
    module: 'accounting',
  },
  {
    code: 'accounting.bank-accounts.delete',
    name: 'Delete Bank Accounts',
    module: 'accounting',
  },
  {
    code: 'accounting.bank-accounts.read',
    name: 'View Bank Accounts',
    module: 'accounting',
  },
  {
    code: 'accounting.bank-accounts.update',
    name: 'Update Bank Accounts',
    module: 'accounting',
  },
  {
    code: 'accounting.bank-reconciliations.complete',
    name: 'Complete Bank Reconciliations',
    module: 'accounting',
  },
  {
    code: 'accounting.bank-reconciliations.create',
    name: 'Create Bank Reconciliations',
    module: 'accounting',
  },
  {
    code: 'accounting.bank-reconciliations.read',
    name: 'View Bank Reconciliations',
    module: 'accounting',
  },
  {
    code: 'accounting.bank-reconciliations.update',
    name: 'Update Bank Reconciliations',
    module: 'accounting',
  },
  {
    code: 'accounting.bank-transactions.create',
    name: 'Create Bank Transactions',
    module: 'accounting',
  },
  {
    code: 'accounting.bank-transactions.delete',
    name: 'Delete Bank Transactions',
    module: 'accounting',
  },
  {
    code: 'accounting.bank-transactions.read',
    name: 'View Bank Transactions',
    module: 'accounting',
  },
  {
    code: 'accounting.bank-transactions.update',
    name: 'Update Bank Transactions',
    module: 'accounting',
  },
  {
    code: 'accounting.budgets.activate',
    name: 'Activate Budgets',
    module: 'accounting',
  },
  {
    code: 'accounting.budgets.approve',
    name: 'Approve Budgets',
    module: 'accounting',
  },
  {
    code: 'accounting.budgets.close',
    name: 'Close Budgets',
    module: 'accounting',
  },
  {
    code: 'accounting.budgets.create',
    name: 'Create Budgets',
    module: 'accounting',
  },
  {
    code: 'accounting.budgets.delete',
    name: 'Delete Budgets',
    module: 'accounting',
  },
  {
    code: 'accounting.budgets.read',
    name: 'View Budgets',
    module: 'accounting',
  },
  {
    code: 'accounting.budgets.submit',
    name: 'Submit Budgets',
    module: 'accounting',
  },
  {
    code: 'accounting.budgets.update',
    name: 'Update Budgets',
    module: 'accounting',
  },
  {
    code: 'accounting.chart-of-accounts.create',
    name: 'Create Chart Of Accounts',
    module: 'accounting',
  },
  {
    code: 'accounting.chart-of-accounts.delete',
    name: 'Delete Chart Of Accounts',
    module: 'accounting',
  },
  {
    code: 'accounting.chart-of-accounts.read',
    name: 'View Chart Of Accounts',
    module: 'accounting',
  },
  {
    code: 'accounting.chart-of-accounts.update',
    name: 'Update Chart Of Accounts',
    module: 'accounting',
  },
  {
    code: 'accounting.cost-centers.create',
    name: 'Create Cost Centers',
    module: 'accounting',
  },
  {
    code: 'accounting.cost-centers.delete',
    name: 'Delete Cost Centers',
    module: 'accounting',
  },
  {
    code: 'accounting.cost-centers.read',
    name: 'View Cost Centers',
    module: 'accounting',
  },
  {
    code: 'accounting.cost-centers.update',
    name: 'Update Cost Centers',
    module: 'accounting',
  },
  {
    code: 'accounting.fiscal-periods.close',
    name: 'Close Fiscal Periods',
    module: 'accounting',
  },
  {
    code: 'accounting.fiscal-periods.create',
    name: 'Create Fiscal Periods',
    module: 'accounting',
  },
  {
    code: 'accounting.fiscal-periods.read',
    name: 'View Fiscal Periods',
    module: 'accounting',
  },
  {
    code: 'accounting.fiscal-periods.reopen',
    name: 'Reopen Fiscal Periods',
    module: 'accounting',
  },
  {
    code: 'accounting.fiscal-periods.update',
    name: 'Update Fiscal Periods',
    module: 'accounting',
  },
  {
    code: 'accounting.fiscal-years.close',
    name: 'Close Fiscal Years',
    module: 'accounting',
  },
  {
    code: 'accounting.fiscal-years.create',
    name: 'Create Fiscal Years',
    module: 'accounting',
  },
  {
    code: 'accounting.fiscal-years.delete',
    name: 'Delete Fiscal Years',
    module: 'accounting',
  },
  {
    code: 'accounting.fiscal-years.read',
    name: 'View Fiscal Years',
    module: 'accounting',
  },
  {
    code: 'accounting.fiscal-years.update',
    name: 'Update Fiscal Years',
    module: 'accounting',
  },
  {
    code: 'accounting.general-ledger.read',
    name: 'View General Ledger',
    module: 'accounting',
  },
  {
    code: 'accounting.journal-entries.create',
    name: 'Create Journal Entries',
    module: 'accounting',
  },
  {
    code: 'accounting.journal-entries.delete',
    name: 'Delete Journal Entries',
    module: 'accounting',
  },
  {
    code: 'accounting.journal-entries.post',
    name: 'Post Journal Entries',
    module: 'accounting',
  },
  {
    code: 'accounting.journal-entries.read',
    name: 'View Journal Entries',
    module: 'accounting',
  },
  {
    code: 'accounting.journal-entries.reverse',
    name: 'Reverse Journal Entries',
    module: 'accounting',
  },
  {
    code: 'accounting.journal-entries.update',
    name: 'Update Journal Entries',
    module: 'accounting',
  },
  {
    code: 'accounting.reports.read',
    name: 'View Reports',
    module: 'accounting',
  },

  // adjustments
  {
    code: 'adjustments.approve',
    name: 'Approve Adjustments',
    module: 'adjustments',
  },
  {
    code: 'adjustments.create',
    name: 'Create Adjustments',
    module: 'adjustments',
  },
  {
    code: 'adjustments.delete',
    name: 'Delete Adjustments',
    module: 'adjustments',
  },
  { code: 'adjustments.read', name: 'View Adjustments', module: 'adjustments' },
  {
    code: 'adjustments.update',
    name: 'Update Adjustments',
    module: 'adjustments',
  },

  // approvals — cross-cutting approval behaviour
  //
  // Lifts the maker-checker rule, which otherwise refuses to let anyone
  // approve a document they raised themselves. ADMIN holds the whole
  // catalogue, so a tenant admin has this automatically; grant it to another
  // role only where one person legitimately runs both ends of a process.
  {
    code: 'approvals.self',
    name: 'Approve Own Documents',
    module: 'approvals',
  },

  // audit_logs
  { code: 'audit_logs.read', name: 'View Audit Logs', module: 'audit_logs' },

  // brands
  { code: 'brands.create', name: 'Create Brands', module: 'brands' },
  { code: 'brands.delete', name: 'Delete Brands', module: 'brands' },
  { code: 'brands.read', name: 'View Brands', module: 'brands' },
  { code: 'brands.update', name: 'Update Brands', module: 'brands' },

  // categories
  {
    code: 'categories.create',
    name: 'Create Categories',
    module: 'categories',
  },
  {
    code: 'categories.delete',
    name: 'Delete Categories',
    module: 'categories',
  },
  { code: 'categories.read', name: 'View Categories', module: 'categories' },
  {
    code: 'categories.update',
    name: 'Update Categories',
    module: 'categories',
  },

  // collections
  {
    code: 'collections.create',
    name: 'Create Collections',
    module: 'collections',
  },
  { code: 'collections.read', name: 'View Collections', module: 'collections' },
  {
    code: 'collections.update',
    name: 'Update Collections',
    module: 'collections',
  },

  // credit_notes
  {
    code: 'credit_notes.approve',
    name: 'Approve Credit Notes',
    module: 'credit_notes',
  },
  {
    code: 'credit_notes.create',
    name: 'Create Credit Notes',
    module: 'credit_notes',
  },
  {
    code: 'credit_notes.read',
    name: 'View Credit Notes',
    module: 'credit_notes',
  },
  {
    code: 'credit_notes.update',
    name: 'Update Credit Notes',
    module: 'credit_notes',
  },

  // customer_dues
  {
    code: 'customer_dues.create',
    name: 'Create Customer Dues',
    module: 'customer_dues',
  },
  {
    code: 'customer_dues.read',
    name: 'View Customer Dues',
    module: 'customer_dues',
  },
  {
    code: 'customer_dues.update',
    name: 'Update Customer Dues',
    module: 'customer_dues',
  },

  // customer_groups
  {
    code: 'customer_groups.create',
    name: 'Create Customer Groups',
    module: 'customer_groups',
  },
  {
    code: 'customer_groups.delete',
    name: 'Delete Customer Groups',
    module: 'customer_groups',
  },
  {
    code: 'customer_groups.read',
    name: 'View Customer Groups',
    module: 'customer_groups',
  },
  {
    code: 'customer_groups.update',
    name: 'Update Customer Groups',
    module: 'customer_groups',
  },

  // customers
  { code: 'customers.create', name: 'Create Customers', module: 'customers' },
  { code: 'customers.delete', name: 'Delete Customers', module: 'customers' },
  { code: 'customers.export', name: 'Export Customers', module: 'customers' },
  { code: 'customers.import', name: 'Import Customers', module: 'customers' },
  { code: 'customers.read', name: 'View Customers', module: 'customers' },
  { code: 'customers.update', name: 'Update Customers', module: 'customers' },

  // dashboard
  { code: 'dashboard.analytics', name: 'View Analytics', module: 'dashboard' },
  { code: 'dashboard.view', name: 'View Dashboard', module: 'dashboard' },

  // debit_notes
  {
    code: 'debit_notes.approve',
    name: 'Approve Debit Notes',
    module: 'debit_notes',
  },
  {
    code: 'debit_notes.create',
    name: 'Create Debit Notes',
    module: 'debit_notes',
  },
  { code: 'debit_notes.read', name: 'View Debit Notes', module: 'debit_notes' },
  {
    code: 'debit_notes.update',
    name: 'Update Debit Notes',
    module: 'debit_notes',
  },

  // expenses
  { code: 'expenses.create', name: 'Create Expenses', module: 'expenses' },
  { code: 'expenses.read', name: 'View Expenses', module: 'expenses' },
  { code: 'expenses.update', name: 'Update Expenses', module: 'expenses' },

  // grn
  { code: 'grn.approve', name: 'Approve GRN', module: 'grn' },
  { code: 'grn.create', name: 'Create GRN', module: 'grn' },
  { code: 'grn.delete', name: 'Delete Grn', module: 'grn' },
  { code: 'grn.qc', name: 'Quality Check Grn', module: 'grn' },
  { code: 'grn.read', name: 'View GRN', module: 'grn' },
  { code: 'grn.update', name: 'Update GRN', module: 'grn' },

  // hr
  { code: 'hr.attendance.create', name: 'Record Attendance', module: 'hr' },
  { code: 'hr.attendance.read', name: 'View Attendance', module: 'hr' },
  { code: 'hr.attendance.update', name: 'Update Attendance', module: 'hr' },
  { code: 'hr.departments.create', name: 'Create Departments', module: 'hr' },
  { code: 'hr.departments.delete', name: 'Delete Departments', module: 'hr' },
  { code: 'hr.departments.read', name: 'View Departments', module: 'hr' },
  { code: 'hr.departments.update', name: 'Update Departments', module: 'hr' },
  { code: 'hr.designations.create', name: 'Create Designations', module: 'hr' },
  { code: 'hr.designations.delete', name: 'Delete Designations', module: 'hr' },
  { code: 'hr.designations.read', name: 'View Designations', module: 'hr' },
  { code: 'hr.designations.update', name: 'Update Designations', module: 'hr' },
  { code: 'hr.employees.create', name: 'Create Employees', module: 'hr' },
  { code: 'hr.employees.delete', name: 'Delete Employees', module: 'hr' },
  { code: 'hr.employees.read', name: 'View Employees', module: 'hr' },
  { code: 'hr.employees.update', name: 'Update Employees', module: 'hr' },
  {
    code: 'hr.leave-requests.approve',
    name: 'Approve/Reject Leave Requests',
    module: 'hr',
  },
  {
    code: 'hr.leave-requests.create',
    name: 'Submit Leave Requests',
    module: 'hr',
  },
  {
    code: 'hr.leave-requests.delete',
    name: 'Delete Leave Requests',
    module: 'hr',
  },
  { code: 'hr.leave-requests.read', name: 'View Leave Requests', module: 'hr' },
  { code: 'hr.leave-types.create', name: 'Create Leave Types', module: 'hr' },
  { code: 'hr.leave-types.delete', name: 'Delete Leave Types', module: 'hr' },
  { code: 'hr.leave-types.read', name: 'View Leave Types', module: 'hr' },
  { code: 'hr.leave-types.update', name: 'Update Leave Types', module: 'hr' },
  { code: 'hr.payroll.approve', name: 'Approve & Pay Payroll', module: 'hr' },
  { code: 'hr.payroll.create', name: 'Process Payroll', module: 'hr' },
  { code: 'hr.payroll.delete', name: 'Delete Draft Payroll', module: 'hr' },
  { code: 'hr.payroll.read', name: 'View Payroll', module: 'hr' },

  // inventory
  { code: 'inventory.adjust', name: 'Adjust Inventory', module: 'inventory' },
  { code: 'inventory.count', name: 'Count Inventory', module: 'inventory' },
  { code: 'inventory.read', name: 'View Inventory', module: 'inventory' },
  {
    code: 'inventory.transfer',
    name: 'Transfer Inventory',
    module: 'inventory',
  },

  // locations
  { code: 'locations.create', name: 'Create Locations', module: 'locations' },
  { code: 'locations.delete', name: 'Delete Locations', module: 'locations' },
  { code: 'locations.read', name: 'View Locations', module: 'locations' },
  { code: 'locations.update', name: 'Update Locations', module: 'locations' },

  // orders
  { code: 'orders.create', name: 'Create Orders', module: 'orders' },
  { code: 'orders.delete', name: 'Delete Orders', module: 'orders' },
  {
    code: 'orders.payment',
    name: 'Record Payment For Orders',
    module: 'orders',
  },
  { code: 'orders.read', name: 'View Orders', module: 'orders' },
  { code: 'orders.update', name: 'Update Orders', module: 'orders' },

  // payment-methods
  {
    code: 'payment-methods.create',
    name: 'Create Payment Methods',
    module: 'payment-methods',
  },
  {
    code: 'payment-methods.delete',
    name: 'Delete Payment Methods',
    module: 'payment-methods',
  },
  {
    code: 'payment-methods.read',
    name: 'View Payment Methods',
    module: 'payment-methods',
  },
  {
    code: 'payment-methods.update',
    name: 'Update Payment Methods',
    module: 'payment-methods',
  },

  // payment_reminders
  {
    code: 'payment_reminders.create',
    name: 'Create Payment Reminders',
    module: 'payment_reminders',
  },
  {
    code: 'payment_reminders.read',
    name: 'View Payment Reminders',
    module: 'payment_reminders',
  },
  {
    code: 'payment_reminders.update',
    name: 'Update Payment Reminders',
    module: 'payment_reminders',
  },

  // payments
  { code: 'payments.create', name: 'Create Payments', module: 'payments' },
  { code: 'payments.read', name: 'View Payments', module: 'payments' },
  { code: 'payments.refund', name: 'Refund Payments', module: 'payments' },

  // permissions — managing the catalogue itself
  {
    code: 'permissions.create',
    name: 'Create Custom Permissions',
    module: 'permissions',
  },
  {
    code: 'permissions.update',
    name: 'Update Custom Permissions',
    module: 'permissions',
  },
  {
    code: 'permissions.delete',
    name: 'Delete Custom Permissions',
    module: 'permissions',
  },

  // price-lists
  {
    code: 'price-lists.create',
    name: 'Create Price Lists',
    module: 'price-lists',
  },
  {
    code: 'price-lists.delete',
    name: 'Delete Price Lists',
    module: 'price-lists',
  },
  { code: 'price-lists.read', name: 'View Price Lists', module: 'price-lists' },
  {
    code: 'price-lists.update',
    name: 'Update Price Lists',
    module: 'price-lists',
  },

  // price_lists
  {
    code: 'price_lists.create',
    name: 'Create Price Lists',
    module: 'price_lists',
  },
  {
    code: 'price_lists.delete',
    name: 'Delete Price Lists',
    module: 'price_lists',
  },
  { code: 'price_lists.read', name: 'View Price Lists', module: 'price_lists' },
  {
    code: 'price_lists.update',
    name: 'Update Price Lists',
    module: 'price_lists',
  },

  // products
  { code: 'products.create', name: 'Create Products', module: 'products' },
  { code: 'products.delete', name: 'Delete Products', module: 'products' },
  { code: 'products.export', name: 'Export Products', module: 'products' },
  { code: 'products.import', name: 'Import Products', module: 'products' },
  { code: 'products.read', name: 'View Products', module: 'products' },
  { code: 'products.update', name: 'Update Products', module: 'products' },

  // purchase-orders
  {
    code: 'purchase-orders.approve',
    name: 'Approve Purchase Orders',
    module: 'purchase-orders',
  },
  {
    code: 'purchase-orders.create',
    name: 'Create Purchase Orders',
    module: 'purchase-orders',
  },
  {
    code: 'purchase-orders.delete',
    name: 'Delete Purchase Orders',
    module: 'purchase-orders',
  },
  {
    code: 'purchase-orders.read',
    name: 'View Purchase Orders',
    module: 'purchase-orders',
  },
  {
    code: 'purchase-orders.update',
    name: 'Update Purchase Orders',
    module: 'purchase-orders',
  },

  // purchase-returns
  {
    code: 'purchase-returns.approve',
    name: 'Approve Purchase Returns',
    module: 'purchase-returns',
  },
  {
    code: 'purchase-returns.create',
    name: 'Create Purchase Returns',
    module: 'purchase-returns',
  },
  {
    code: 'purchase-returns.delete',
    name: 'Delete Purchase Returns',
    module: 'purchase-returns',
  },
  {
    code: 'purchase-returns.read',
    name: 'View Purchase Returns',
    module: 'purchase-returns',
  },
  {
    code: 'purchase-returns.update',
    name: 'Update Purchase Returns',
    module: 'purchase-returns',
  },

  // purchase_orders
  {
    code: 'purchase_orders.approve',
    name: 'Approve Purchase Orders',
    module: 'purchase_orders',
  },
  {
    code: 'purchase_orders.create',
    name: 'Create Purchase Orders',
    module: 'purchase_orders',
  },
  {
    code: 'purchase_orders.delete',
    name: 'Delete Purchase Orders',
    module: 'purchase_orders',
  },
  {
    code: 'purchase_orders.read',
    name: 'View Purchase Orders',
    module: 'purchase_orders',
  },
  {
    code: 'purchase_orders.receive',
    name: 'Receive Purchase Orders',
    module: 'purchase_orders',
  },
  {
    code: 'purchase_orders.reject',
    name: 'Reject Purchase Orders',
    module: 'purchase_orders',
  },
  {
    code: 'purchase_orders.send',
    name: 'Send Purchase Orders',
    module: 'purchase_orders',
  },
  {
    code: 'purchase_orders.update',
    name: 'Update Purchase Orders',
    module: 'purchase_orders',
  },

  // purchase_returns
  {
    code: 'purchase_returns.approve',
    name: 'Approve Purchase Returns',
    module: 'purchase_returns',
  },
  {
    code: 'purchase_returns.create',
    name: 'Create Purchase Returns',
    module: 'purchase_returns',
  },
  {
    code: 'purchase_returns.read',
    name: 'View Purchase Returns',
    module: 'purchase_returns',
  },
  {
    code: 'purchase_returns.update',
    name: 'Update Purchase Returns',
    module: 'purchase_returns',
  },

  // quotations
  {
    code: 'quotations.convert',
    name: 'Convert Quotations',
    module: 'quotations',
  },
  {
    code: 'quotations.create',
    name: 'Create Quotations',
    module: 'quotations',
  },
  {
    code: 'quotations.delete',
    name: 'Delete Quotations',
    module: 'quotations',
  },
  { code: 'quotations.read', name: 'View Quotations', module: 'quotations' },
  { code: 'quotations.send', name: 'Send Quotations', module: 'quotations' },
  {
    code: 'quotations.update',
    name: 'Update Quotations',
    module: 'quotations',
  },

  // reports
  { code: 'reports.export', name: 'Export Reports', module: 'reports' },
  {
    code: 'reports.financial',
    name: 'View Financial Reports',
    module: 'reports',
  },
  {
    code: 'reports.inventory',
    name: 'View Inventory Reports',
    module: 'reports',
  },
  {
    code: 'reports.purchase',
    name: 'View Purchase Reports',
    module: 'reports',
  },
  { code: 'reports.sales', name: 'View Sales Reports', module: 'reports' },

  // returns
  { code: 'returns.approve', name: 'Approve Returns', module: 'returns' },
  { code: 'returns.create', name: 'Create Returns', module: 'returns' },
  { code: 'returns.delete', name: 'Delete Returns', module: 'returns' },
  { code: 'returns.read', name: 'View Returns', module: 'returns' },
  { code: 'returns.refund', name: 'Refund Returns', module: 'returns' },
  { code: 'returns.update', name: 'Update Returns', module: 'returns' },

  // roles
  { code: 'roles.assign', name: 'Assign Roles', module: 'roles' },
  { code: 'roles.create', name: 'Create Roles', module: 'roles' },
  { code: 'roles.delete', name: 'Delete Roles', module: 'roles' },
  { code: 'roles.read', name: 'View Roles', module: 'roles' },
  { code: 'roles.update', name: 'Update Roles', module: 'roles' },

  // sales_orders
  {
    code: 'sales_orders.cancel',
    name: 'Cancel Sales Orders',
    module: 'sales_orders',
  },
  {
    code: 'sales_orders.confirm',
    name: 'Confirm Sales Orders',
    module: 'sales_orders',
  },
  {
    code: 'sales_orders.create',
    name: 'Create Sales Orders',
    module: 'sales_orders',
  },
  {
    code: 'sales_orders.delete',
    name: 'Delete Sales Orders',
    module: 'sales_orders',
  },
  {
    code: 'sales_orders.deliver',
    name: 'Deliver Sales Orders',
    module: 'sales_orders',
  },
  {
    code: 'sales_orders.read',
    name: 'View Sales Orders',
    module: 'sales_orders',
  },
  {
    code: 'sales_orders.ship',
    name: 'Ship Sales Orders',
    module: 'sales_orders',
  },
  {
    code: 'sales_orders.update',
    name: 'Update Sales Orders',
    module: 'sales_orders',
  },

  // sales_returns
  {
    code: 'sales_returns.approve',
    name: 'Approve Sales Returns',
    module: 'sales_returns',
  },
  {
    code: 'sales_returns.create',
    name: 'Create Sales Returns',
    module: 'sales_returns',
  },
  {
    code: 'sales_returns.read',
    name: 'View Sales Returns',
    module: 'sales_returns',
  },
  {
    code: 'sales_returns.reject',
    name: 'Reject Sales Returns',
    module: 'sales_returns',
  },
  {
    code: 'sales_returns.update',
    name: 'Update Sales Returns',
    module: 'sales_returns',
  },

  // settings
  {
    code: 'settings.company',
    name: 'Manage Company Settings',
    module: 'settings',
  },
  { code: 'settings.read', name: 'View Settings', module: 'settings' },
  { code: 'settings.update', name: 'Update Settings', module: 'settings' },

  // stock
  { code: 'stock.read', name: 'View Stock', module: 'stock' },
  { code: 'stock.write', name: 'Manage Stock', module: 'stock' },

  // stock_adjustments
  {
    code: 'stock_adjustments.approve',
    name: 'Approve Stock Adjustments',
    module: 'stock_adjustments',
  },
  {
    code: 'stock_adjustments.create',
    name: 'Create Stock Adjustments',
    module: 'stock_adjustments',
  },
  {
    code: 'stock_adjustments.read',
    name: 'View Stock Adjustments',
    module: 'stock_adjustments',
  },

  // stock_transfers
  {
    code: 'stock_transfers.approve',
    name: 'Approve Stock Transfers',
    module: 'stock_transfers',
  },
  {
    code: 'stock_transfers.create',
    name: 'Create Stock Transfers',
    module: 'stock_transfers',
  },
  {
    code: 'stock_transfers.read',
    name: 'View Stock Transfers',
    module: 'stock_transfers',
  },
  {
    code: 'stock_transfers.receive',
    name: 'Receive Stock Transfers',
    module: 'stock_transfers',
  },
  {
    code: 'stock_transfers.ship',
    name: 'Ship Stock Transfers',
    module: 'stock_transfers',
  },

  // supplier_dues
  {
    code: 'supplier_dues.create',
    name: 'Create Supplier Dues',
    module: 'supplier_dues',
  },
  {
    code: 'supplier_dues.read',
    name: 'View Supplier Dues',
    module: 'supplier_dues',
  },
  {
    code: 'supplier_dues.update',
    name: 'Update Supplier Dues',
    module: 'supplier_dues',
  },

  // supplier_payments
  {
    code: 'supplier_payments.approve',
    name: 'Approve Supplier Payments',
    module: 'supplier_payments',
  },
  {
    code: 'supplier_payments.create',
    name: 'Create Supplier Payments',
    module: 'supplier_payments',
  },
  {
    code: 'supplier_payments.read',
    name: 'View Supplier Payments',
    module: 'supplier_payments',
  },
  {
    code: 'supplier_payments.update',
    name: 'Update Supplier Payments',
    module: 'supplier_payments',
  },

  // suppliers
  { code: 'suppliers.create', name: 'Create Suppliers', module: 'suppliers' },
  { code: 'suppliers.delete', name: 'Delete Suppliers', module: 'suppliers' },
  { code: 'suppliers.export', name: 'Export Suppliers', module: 'suppliers' },
  { code: 'suppliers.import', name: 'Import Suppliers', module: 'suppliers' },
  { code: 'suppliers.read', name: 'View Suppliers', module: 'suppliers' },
  { code: 'suppliers.update', name: 'Update Suppliers', module: 'suppliers' },

  // tax
  { code: 'tax.create', name: 'Create Tax Rates', module: 'tax' },
  { code: 'tax.delete', name: 'Delete Tax Rates', module: 'tax' },
  { code: 'tax.read', name: 'View Tax Settings', module: 'tax' },
  { code: 'tax.update', name: 'Update Tax Rates', module: 'tax' },
  { code: 'tax.write', name: 'Manage Tax', module: 'tax' },

  // transfers
  { code: 'transfers.approve', name: 'Approve Transfers', module: 'transfers' },
  { code: 'transfers.create', name: 'Create Transfers', module: 'transfers' },
  { code: 'transfers.delete', name: 'Delete Transfers', module: 'transfers' },
  { code: 'transfers.read', name: 'View Transfers', module: 'transfers' },
  { code: 'transfers.receive', name: 'Receive Transfers', module: 'transfers' },
  { code: 'transfers.ship', name: 'Ship Transfers', module: 'transfers' },
  { code: 'transfers.update', name: 'Update Transfers', module: 'transfers' },

  // units
  { code: 'units.create', name: 'Create Units', module: 'units' },
  { code: 'units.delete', name: 'Delete Units', module: 'units' },
  { code: 'units.read', name: 'View Units', module: 'units' },
  { code: 'units.update', name: 'Update Units', module: 'units' },

  // users
  { code: 'users.create', name: 'Create Users', module: 'users' },
  { code: 'users.delete', name: 'Delete Users', module: 'users' },
  {
    code: 'users.manage-roles',
    name: 'Manage Roles For Users',
    module: 'users',
  },
  { code: 'users.read', name: 'View Users', module: 'users' },
  { code: 'users.update', name: 'Update Users', module: 'users' },

  // warehouse_locations
  {
    code: 'warehouse_locations.create',
    name: 'Create Warehouse Locations',
    module: 'warehouse_locations',
  },
  {
    code: 'warehouse_locations.delete',
    name: 'Delete Warehouse Locations',
    module: 'warehouse_locations',
  },
  {
    code: 'warehouse_locations.read',
    name: 'View Warehouse Locations',
    module: 'warehouse_locations',
  },
  {
    code: 'warehouse_locations.update',
    name: 'Update Warehouse Locations',
    module: 'warehouse_locations',
  },

  // warehouses
  {
    code: 'warehouses.create',
    name: 'Create Warehouses',
    module: 'warehouses',
  },
  {
    code: 'warehouses.delete',
    name: 'Delete Warehouses',
    module: 'warehouses',
  },
  { code: 'warehouses.read', name: 'View Warehouses', module: 'warehouses' },
  {
    code: 'warehouses.update',
    name: 'Update Warehouses',
    module: 'warehouses',
  },
];

/** Fast membership test used by the startup assertion. */
export const PERMISSION_CODES: ReadonlySet<string> = new Set(
  PERMISSIONS.map((p) => p.code),
);

/**
 * Codes gating the SaaS control plane (the `master/*` routes).
 *
 * These are deliberately absent from PERMISSIONS. Those routes are guarded by
 * AdminJwtAuthGuard and admin tokens bypass PermissionsGuard entirely, so the
 * codes never need to resolve — and making them grantable tenant permissions
 * would hand any tenant ADMIN control over other tenants.
 */
export const isControlPlanePermission = (code: string): boolean =>
  code.startsWith('master.');

/**
 * Default grants for the non-admin system roles seeded with every tenant.
 * ADMIN is deliberately absent: it receives the full catalogue.
 */
export const ROLE_PERMISSIONS: Readonly<Record<string, readonly string[]>> = {
  MANAGER: [
    'brands.create',
    'brands.read',
    'brands.update',
    'categories.create',
    'categories.read',
    'categories.update',
    'customers.create',
    'customers.read',
    'customers.update',
    'dashboard.analytics',
    'dashboard.view',
    'orders.create',
    'orders.read',
    'orders.update',
    'products.create',
    'products.read',
    'products.update',
    'purchase-orders.approve',
    'purchase-orders.create',
    'purchase-orders.read',
    'purchase-orders.update',
    'quotations.create',
    'quotations.read',
    'quotations.update',
    'reports.inventory',
    'reports.purchase',
    'reports.sales',
    'settings.read',
    'stock.read',
    'stock.write',
    'suppliers.create',
    'suppliers.read',
    'suppliers.update',
    // 'users.read',
    'hr.attendance.read',
    'hr.employees.read',
    'hr.leave-requests.read',
    'hr.payroll.read',
    'warehouses.read',
  ],
  SALES: [
    'brands.read',
    'categories.read',
    'customers.create',
    'customers.read',
    'customers.update',
    'dashboard.view',
    'orders.create',
    'orders.payment',
    'orders.read',
    'orders.update',
    // payments.* is the legacy spelling and no controller checks it. The
    // enforced code for recording a payment against a sales order is
    // orders.payment, above; without it this role could not take payment.
    'payments.create',
    'payments.read',
    'products.read',
    'quotations.create',
    'quotations.read',
    'quotations.send',
    'quotations.update',
    'reports.sales',
    'returns.create',
    'returns.read',
    'stock.read',
  ],
  PURCHASE: [
    'brands.read',
    'categories.read',
    'dashboard.view',
    'grn.create',
    'grn.read',
    'products.read',
    'purchase-orders.create',
    'purchase-orders.read',
    'purchase-orders.update',
    'purchase-returns.create',
    'purchase-returns.read',
    'reports.purchase',
    'stock.read',
    'suppliers.create',
    'suppliers.read',
    'suppliers.update',
  ],
  WAREHOUSE: [
    'adjustments.create',
    'adjustments.read',
    'dashboard.view',
    'grn.create',
    'grn.read',
    'locations.create',
    'locations.read',
    'locations.update',
    'products.read',
    'reports.inventory',
    'stock.read',
    'stock.write',
    'transfers.create',
    'transfers.read',
    'transfers.receive',
    'transfers.ship',
    'warehouses.read',
  ],
};
