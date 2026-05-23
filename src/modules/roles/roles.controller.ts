import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, ParseUUIDPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { Permissions } from '@common/decorators/permissions.decorator';

@ApiTags('Roles & Permissions')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(private readonly service: RolesService) {}

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
  updateRole(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateRoleDto) {
    return this.service.updateRole(id, dto);
  }

  @Delete(':id')
  @Permissions('roles.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a non-system role (only if no users assigned)' })
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

  // ── Permissions catalogue ──────────────────────────────────────────────

  @Get('catalogue/permissions')
  @Permissions('roles.read')
  @ApiOperation({ summary: 'List all available permissions grouped by module' })
  findAllPermissions() {
    return this.service.findAllPermissions();
  }
}
