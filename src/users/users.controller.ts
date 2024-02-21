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

  /**
   * Extract JwtAuthGuard + @ApiBearerAuth('JWT-auth') into another decorator for reusable purpose
   * For example: @IsAuthenticated()
   */
  @UseGuards(JwtAuthGuard, PermissionGuard)
  /**
   * Wrap @SetMetadata('permissions', ['create:users']) into another decorator for hiding details of authorization and reusable purpose
   * For example: @ContainsPermissions('create:users')
   */
  @SetMetadata('permissions', ['create:users'])
  /**
   * Permissions like create:users, read:users should be extracted to constants for reusable and clean code
   * For example: export enum PERMISSIONS {CREATE_USERS: 'create:users'}
   */
  @ApiBearerAuth('JWT-auth')
  @Post()
  /**
   * Missing data validation from external http request
   * Please provide validation for CreateUserDto
   */
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
