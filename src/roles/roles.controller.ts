import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AssignRoleDto } from './dto/assign-role.dto';
import { PermissionGuard } from 'src/account-services/authentication/guards/permissions.guard';
import { JwtAuthGuard } from 'src/account-services/authentication/guards/jwt.guard';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @SetMetadata('permissions', ['create:role'])
  @ApiBearerAuth('JWT-auth')
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @SetMetadata('permissions', ['read:roles'])
  @ApiBearerAuth('JWT-auth')
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @SetMetadata('permissions', ['read:roles'])
  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne({ where: { id } });
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @SetMetadata('permissions', ['read:roles'])
  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }

  @Post('assign')
  assignRole(@Body() assignRoleDto: AssignRoleDto) {
    return this.rolesService.assignRole(assignRoleDto);
  }

  @Get('users/:id')
  getUsers(@Param('id') id: string) {
    return this.rolesService.getRolesByUserId(+id);
  }
}
