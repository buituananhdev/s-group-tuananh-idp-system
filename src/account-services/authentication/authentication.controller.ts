import { Controller, Get, Post, Body, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LocalGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Request } from 'express';
import { PermissionGuard } from './guards/permissions.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService
    ) {}

  @Post('/login')
  @UseGuards(LocalGuard)
  login(@Body() loginDto: LoginDto) {
    return this.authenticationService.login(loginDto);
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
