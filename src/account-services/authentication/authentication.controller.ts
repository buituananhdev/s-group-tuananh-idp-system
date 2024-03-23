import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';
import { Identified } from 'src/common/decorators/index';
import { GoogleAuthGuard } from './guards/google.guard';

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

  @Get('/google/login')
  @UseGuards(GoogleAuthGuard)
  googleLogin(@Body() loginDto: LoginDto) {
    return this.authenticationService.login(loginDto);
  }

  @Get('/google/redirect')
  @UseGuards(GoogleAuthGuard)
  googleLoginRedirect(@Req() req: Request) {
  }

  @Identified
  @Get('test')
  status(@Req() req: Request) {
    console.log("Inside status", req.user);
    return req.user;
  }
}
