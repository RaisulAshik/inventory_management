import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permissions } from '@common/decorators/permissions.decorator';

@ApiTags('Roles & Permissions')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(private readonly service: RolesService) {}

  // ── Permissions catalogue ──────────────────────────────────────────────
  //
  // Declared before the ':id' routes on purpose. Nest matches in declaration
  // order, so 'catalogue/permissions' would otherwise be captured by
  // ':id/permissions' with id='catalogue' and rejected by ParseUUIDPipe.

  @Get('catalogue/permissions')
  @Permissions('roles.read')
  @ApiOperation({
    summary: 'List all available permissions grouped by module',
    description:
      'Each entry carries isSystem: true for permissions the application ships and enforces, false for ones added here.',
  })
  findAllPermissions() {
    return this.service.findAllPermissions();
  }

  @Post('catalogue/permissions')
  @Permissions('permissions.create')
  @ApiOperation({
    summary: 'Create a custom permission',
    description:
      'The new code is NOT enforced by the API — endpoints are guarded in code. It does reach the client in the user permission list, so the front end can gate features with it. To guard an endpoint, add the code to src/common/constants/permissions.ts and a @Permissions() decorator.',
  })
  @ApiResponse({ status: 409, description: 'That code already exists' })
  createPermission(@Body() dto: CreatePermissionDto) {
    return this.service.createPermission(dto);
  }

  @Patch('catalogue/permissions/:id')
  @Permissions('permissions.update')
  @ApiOperation({
    summary: 'Rename or re-group a custom permission',
    description:
      'The code itself cannot be changed: role grants and clients refer to it. Built-in permissions cannot be edited.',
  })
  @ApiResponse({
    status: 400,
    description: 'Built-in permissions are read-only',
  })
  updatePermission(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePermissionDto,
  ) {
    return this.service.updatePermission(id, dto);
  }

  @Delete('catalogue/permissions/:id')
  @Permissions('permissions.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a custom permission',
    description:
      'Any role grants of it go with it. Built-in permissions cannot be deleted.',
  })
  @ApiResponse({
    status: 400,
    description: 'Built-in permissions cannot be deleted',
  })
  deletePermission(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.deletePermission(id);
  }

  // ── Roles ──────────────────────────────────────────────────────────────

  @Get()
  @Permissions('roles.read')
  @ApiOperation({ summary: 'List all roles with their permissions' })
  findAllRoles() {
    return this.service.findAllRoles();
  }

  @Post()
  @Permissions('roles.create')
  @ApiOperation({ summary: 'Create a new role' })
  createRole(@Body() dto: CreateRoleDto) {
    return this.service.createRole(dto);
  }

  @Get(':id')
  @Permissions('roles.read')
  @ApiOperation({ summary: 'Get role by ID with permissions' })
  findOneRole(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOneRole(id);
  }

  @Patch(':id')
  @Permissions('roles.update')
  @ApiOperation({ summary: 'Update role name / description / active status' })
  updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.service.updateRole(id, dto);
  }

  @Delete(':id')
  @Permissions('roles.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a non-system role (only if no users assigned)',
  })
  deleteRole(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.deleteRole(id);
  }

  @Post(':id/permissions')
  @Permissions('roles.assign')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Replace all permissions for a role' })
  assignPermissions(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignPermissionsDto,
  ) {
    return this.service.assignPermissions(id, dto);
  }
}
