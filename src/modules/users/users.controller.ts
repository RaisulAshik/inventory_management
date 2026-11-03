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

  /**
   * The signed-in user's own permission codes.
   *
   * Deliberately ungated. The `:id` variants below require `users.read`,
   * which a Sales or Warehouse user does not have — so reading their OWN
   * grants returned 403, the app fell back to no permissions, and they got
   * an empty menu and a 403 page. Needing permission to discover your own
   * permissions is a deadlock; the token already proves who you are, and
   * this reveals nothing they could not learn by clicking around.
   */
  @Get('me/permissions')
  @ApiOperation({ summary: "The signed-in user's own permissions" })
  async getMyPermissions(@CurrentUser() user: JwtPayload) {
    const permissions = await this.usersService.getUserPermissions(user.sub);
    return { permissions };
  }

  /** The signed-in user's own roles. Ungated, as above. */
  @Get('me/roles')
  @ApiOperation({ summary: "The signed-in user's own roles" })
  async getMyRoles(@CurrentUser() user: JwtPayload) {
    const roles = await this.usersService.getUserRoles(user.sub);
    return { roles };
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
    // Two reads: the user from master, their roles from this tenant. They
    // cannot be joined — different databases.
    const user = await this.usersService.findById(id);
    const roles = await this.usersService.getUserRoles(id);
    return new UserResponseDto(user, roles);
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
  @Permissions('users.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user (soft delete)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.usersService.remove(id);
  }

  @Post(':id/roles')
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

  /** Another user's roles. Privileged: use `me/roles` for your own. */
  @Get(':id/roles')
  @Permissions('users.read')
  @ApiOperation({ summary: 'Get user roles' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async getUserRoles(@Param('id', ParseUUIDPipe) id: string) {
    const roles = await this.usersService.getUserRoles(id);
    return { roles };
  }

  /**
   * Another user's permissions. Privileged: use `me/permissions` for your
   * own, which every signed-in user can reach.
   */
  @Get(':id/permissions')
  @Permissions('users.read')
  @ApiOperation({ summary: 'Get user permissions' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async getUserPermissions(@Param('id', ParseUUIDPipe) id: string) {
    const permissions = await this.usersService.getUserPermissions(id);
    return { permissions };
  }

  @Post(':id/activate')
  @Permissions('users.update')
  @ApiOperation({ summary: 'Activate user' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async activate(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.activate(id);
    return new UserResponseDto(user);
  }

  @Post(':id/deactivate')
  @Permissions('users.update')
  @ApiOperation({ summary: 'Deactivate user' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async deactivate(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.deactivate(id);
    return new UserResponseDto(user);
  }
}
