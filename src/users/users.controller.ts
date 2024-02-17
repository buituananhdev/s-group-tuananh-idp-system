import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/account-services/authentication/guards/jwt.guard';
import { PermissionGuard } from 'src/account-services/authentication/guards/permissions.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @SetMetadata('permissions', ['create:users'])
  @ApiBearerAuth('JWT-auth')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @SetMetadata('permissions', ['read:users'])
  @ApiBearerAuth('JWT-auth')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @SetMetadata('permissions', ['read:users'])
  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({ where: { id } });
  }
  
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @SetMetadata('permissions', ['update:users'])
  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @SetMetadata('permissions', ['delete:users'])
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
