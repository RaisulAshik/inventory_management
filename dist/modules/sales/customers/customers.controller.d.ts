import { CustomersService } from './customers.service';
import { PaginationDto } from '@common/dto/pagination.dto';
import { JwtPayload } from '@common/interfaces';
import { CreateCustomerAddressDto } from './dto/create-customer-address.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerFilterDto } from './dto/customer-filter.dto';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(createCustomerDto: CreateCustomerDto, currentUser: JwtPayload): Promise<CustomerResponseDto>;
    findAll(filterDto: CustomerFilterDto): Promise<{
        data: CustomerResponseDto[];
        meta: import("@common/interfaces").PaginationMeta;
    }>;
    findByEmail(email: string): Promise<{
        data: CustomerResponseDto | null;
    }>;
    findByCode(code: string): Promise<{
        data: CustomerResponseDto | null;
    }>;
    findOne(id: string): Promise<CustomerResponseDto>;
    getOutstandingBalance(id: string): Promise<{
        balance: number;
    }>;
    getDues(id: string): Promise<{
        data: import("../../../entities/tenant").CustomerDue[];
    }>;
    getOrderHistory(id: string, paginationDto: PaginationDto): Promise<import("@common/interfaces").PaginatedResult<any>>;
    getAddresses(id: string): Promise<{
        data: import("../../../entities/tenant").CustomerAddress[];
    }>;
    checkCreditLimit(id: string, amount: number): Promise<{
        isWithinLimit: boolean;
    }>;
    update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<CustomerResponseDto>;
    updateCreditLimit(id: string, creditLimit: number): Promise<CustomerResponseDto>;
    remove(id: string): Promise<void>;
    addAddress(id: string, addressDto: CreateCustomerAddressDto): Promise<import("../../../entities/tenant").CustomerAddress>;
    updateAddress(addressId: string, addressDto: Partial<CreateCustomerAddressDto>): Promise<import("../../../entities/tenant").CustomerAddress>;
    removeAddress(addressId: string): Promise<void>;
}
