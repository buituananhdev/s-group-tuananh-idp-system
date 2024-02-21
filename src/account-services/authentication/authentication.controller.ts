import { Controller, Get, Post, Body, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LocalGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Request } from 'express';
import { PermissionGuard } from './guards/permissions.guard';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    // Should not contains userService business here, this should be encapsulate in authenticationService
    private readonly usersService: UsersService
    ) {}

  @Post('/login')
  @UseGuards(LocalGuard)
  login(@Body() loginDto: LoginDto) {
    return this.authenticationService.login(loginDto);
  }

  @Post('/register')
  register(@Body() createUserDto: CreateUserDto) {
    /**
     * Why register create user directly? No validation for registering process?
     * Use case should be:
     * - validate username, email, password
     * - send to user service for user creation
     */
    return this.usersService.create(createUserDto);
  }

  @Get('test')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @SetMetadata('permissions', ['read:users'])
  @ApiBearerAuth('JWT-auth')
  status(@Req() req: Request) {
    console.log("Inside status", req.user);
    return req.user;
  }
}
