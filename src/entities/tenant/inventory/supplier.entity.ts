import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { SupplierContact } from './supplier-contact.entity';
import { SupplierProduct } from './supplier-product.entity';
import { PurchaseOrder } from '../purchase/purchase-order.entity';
@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'supplier_code', length: 50, unique: true })
  supplierCode: string;

  @Column({ name: 'company_name', length: 200 })
  companyName: string;

  @Column({ name: 'contact_person', length: 100, nullable: true })
  contactPerson: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ length: 50, nullable: true })
  phone: string;

  @Column({ length: 50, nullable: true })
  mobile: string;

  @Column({ length: 50, nullable: true })
  panNumber: string;

  @Column({ length: 50, nullable: true })
  fax: string;

  @Column({ length: 255, nullable: true })
  website: string;

  @Column({ name: 'tax_id', length: 100, nullable: true })
  taxId: string;

  @Column({ name: 'payment_terms_days', type: 'int', default: 30 })
  paymentTermsDays: number;

  @Column({
    name: 'credit_limit',
    type: 'decimal',
    precision: 18,
    scale: 2,
    default: 0,
  })
  creditLimit: number;

  @Column({ length: 3, default: 'BDT' })
  currency: string;

  @Column({ name: 'address_line1', length: 255, nullable: true })
  addressLine1: string;

  @Column({ name: 'address_line2', length: 255, nullable: true })
  addressLine2: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 100, nullable: true })
  state: string;

  @Column({ length: 100, nullable: true })
  country: string;

  @Column({ name: 'postal_code', length: 20, nullable: true })
  postalCode: string;

  @Column({ name: 'bank_name', length: 200, nullable: true })
  bankName: string;

  @Column({ name: 'bank_account_number', length: 50, nullable: true })
  bankAccountNumber: string;

  @Column({ name: 'bank_ifsc_code', length: 20, nullable: true })
  bankIfscCode: string;

  @Column({ name: 'bank_branch', length: 200, nullable: true })
  bankBranch: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: boolean;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  // Relations
  @OneToMany(() => SupplierContact, (contact) => contact.supplier)
  contacts: SupplierContact[];

  @OneToMany(() => SupplierProduct, (sp) => sp.supplier)
  supplierProducts: SupplierProduct[];

  @OneToMany(() => PurchaseOrder, (po) => po.supplier)
  purchaseOrders: PurchaseOrder[];
}
