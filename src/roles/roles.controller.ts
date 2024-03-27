import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiTags } from '@nestjs/swagger';
import { AssignRoleDto } from './dto/assign-role.dto';
import { Identified, Permission } from 'src/common/decorators/index';
import { PermissionEnum } from 'src/common/enums/index';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }
  
  @Get('seed')
  seedRoles() {
    return this.rolesService.seedRoles();
  }

  // @Identified
	// @Permission([PermissionEnum.CREATE_ROLES])
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  // @Identified
	// @Permission([PermissionEnum.READ_ROLES])
  

  // @Identified
	// @Permission([PermissionEnum.READ_ROLES])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne({ where: { id } });
  }

  // @Identified
	// @Permission([PermissionEnum.UPDATE_ROLES])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  // @Identified
	// @Permission([PermissionEnum.DELETE_ROLES])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }

  // @Identified
	// @Permission([PermissionEnum.ASSIGN_ROLES])
  @Post('assign')
  assignRole(@Body() assignRoleDto: AssignRoleDto) {
    return this.rolesService.assignRole(assignRoleDto);
  }
}
