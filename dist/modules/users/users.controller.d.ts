import { UsersService } from './users.service';
import { PaginationDto } from '@common/dto/pagination.dto';
import { JwtPayload } from '@common/interfaces';
import { AssignRolesDto } from './dto/assign-roles.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(request: any, createUserDto: CreateUserDto, currentUser: JwtPayload): Promise<UserResponseDto>;
    findAll(paginationDto: PaginationDto): Promise<{
        data: UserResponseDto[];
        meta: import("@common/interfaces").PaginationMeta;
    }>;
    findOne(id: string): Promise<UserResponseDto>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto>;
    remove(id: string): Promise<void>;
    assignRoles(id: string, assignRolesDto: AssignRolesDto, currentUser: JwtPayload): Promise<{
        message: string;
    }>;
    getUserRoles(id: string): Promise<{
        roles: string[];
    }>;
    getUserPermissions(id: string): Promise<{
        permissions: string[];
    }>;
    activate(id: string): Promise<UserResponseDto>;
    deactivate(id: string): Promise<UserResponseDto>;
}
