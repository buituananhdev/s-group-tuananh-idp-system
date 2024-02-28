import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';
import { Identified, Permission } from 'src/common/decorators/index';
import { PermissionEnum } from 'src/common/enums';
import { JwtAuthGuard } from './guards/jwt.guard';
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

  @Identified
  @Get('test')
  status(@Req() req: Request) {
    console.log("Inside status", req.user);
    return req.user;
  }
}
