import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { LeaveTypesService } from './leave-types.service';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtPayload } from '@common/interfaces';

@ApiTags('HR - Leave Types')
@ApiBearerAuth()
@Controller('hr/leave-types')
export class LeaveTypesController {
  constructor(private readonly service: LeaveTypesService) {}

  @Post()
  @ApiOperation({ summary: 'Create leave type' })
  create(@Body() dto: CreateLeaveTypeDto, @CurrentUser() user: JwtPayload) {
    return this.service.create(dto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'List leave types' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  findAll(@Query('isActive') isActive?: string) {
    const active = isActive !== undefined ? isActive === 'true' : undefined;
    return this.service.findAll(active);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get leave type by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update leave type' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: Partial<CreateLeaveTypeDto> & { isActive?: boolean }) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete leave type' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
