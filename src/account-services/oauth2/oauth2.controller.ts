import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { Oauth2Service } from './oauth2.service';
import { LoginDto } from '../authentication/dto/login.dto';
import { CreateOauth2Dto } from './dto/create-oauth2.dto';
@Controller('oauth2')
export class Oauth2Controller {
  constructor(private readonly oauth2Service: Oauth2Service) {}

  @Get('/auth/check-client')
  requestOAuth2(
    @Query('redirect_uri') redirect_uri: string,
    @Query('client_id') client_id: string,
    @Req() req: Request
    ) {
    return this.oauth2Service.checkClient(client_id, redirect_uri);
  }

  @Post('/auth/login')
  login(@Body() loginDto: LoginDto) {
    return this.oauth2Service.login(loginDto);
  }

  @Post('/auth/register')
  register(@Body() createOauth2Dto: CreateOauth2Dto) {
    return this.oauth2Service.create(createOauth2Dto);
  }
}
