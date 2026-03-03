import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  //ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { PaginationDto } from '@common/dto/pagination.dto';
import { Roles } from '@common/decorators/roles.decorator';
import { Permissions } from '@common/decorators/permissions.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ApiPaginatedResponse } from '@common/decorators/api-paginated-response.decorator';
import { JwtPayload } from '@common/interfaces';
import { AssignRolesDto } from './dto/assign-roles.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('ADMIN', 'MANAGER')
  @Permissions('users.create')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Req() request: any,
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const tenantId = request.user.tenantId;
    const user = await this.usersService.create(tenantId, {
      ...createUserDto,
      createdBy: currentUser.sub,
    });
    return new UserResponseDto(user);
  }

  @Get()
  @Permissions('users.read')
  @ApiOperation({ summary: 'Get all users with pagination' })
  @ApiPaginatedResponse(UserResponseDto)
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.usersService.findAll(paginationDto);
    return {
      data: result.data.map((user) => new UserResponseDto(user)),
      meta: result.meta,
    };
  }

  @Get(':id')
  @Permissions('users.read')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.findById(id);
    return new UserResponseDto(user);
  }

  @Patch(':id')
  @Permissions('users.update')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(id, updateUserDto);
    return new UserResponseDto(user);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @Permissions('users.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user (soft delete)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.usersService.remove(id);
  }

  @Post(':id/roles')
  @Roles('ADMIN')
  @Permissions('users.manage-roles')
  @ApiOperation({ summary: 'Assign roles to user' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Roles assigned successfully' })
  async assignRoles(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() assignRolesDto: AssignRolesDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    await this.usersService.assignRoles(
      id,
      assignRolesDto.roleIds,
      currentUser.sub,
    );
    return { message: 'Roles assigned successfully' };
  }

  @Get(':id/roles')
  @Permissions('users.read')
  @ApiOperation({ summary: 'Get user roles' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async getUserRoles(@Param('id', ParseUUIDPipe) id: string) {
    const roles = await this.usersService.getUserRoles(id);
    return { roles };
  }

  @Get(':id/permissions')
  @Permissions('users.read')
  @ApiOperation({ summary: 'Get user permissions' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async getUserPermissions(@Param('id', ParseUUIDPipe) id: string) {
    const permissions = await this.usersService.getUserPermissions(id);
    return { permissions };
  }

  @Post(':id/activate')
  @Roles('ADMIN', 'MANAGER')
  @Permissions('users.update')
  @ApiOperation({ summary: 'Activate user' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async activate(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.activate(id);
    return new UserResponseDto(user);
  }

  @Post(':id/deactivate')
  @Roles('ADMIN', 'MANAGER')
  @Permissions('users.update')
  @ApiOperation({ summary: 'Deactivate user' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async deactivate(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.deactivate(id);
    return new UserResponseDto(user);
  }
}
