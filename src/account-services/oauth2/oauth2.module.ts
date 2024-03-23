import { Module } from '@nestjs/common';
import { Oauth2Service } from './oauth2.service';
import { Oauth2Controller } from './oauth2.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OAuth2Client } from './entities/oauth2-client';
import { AuthenticationModule } from '../authentication/authentication.module';


@Module({
  imports: [TypeOrmModule.forFeature([OAuth2Client]), AuthenticationModule],
  controllers: [Oauth2Controller],
  providers: [Oauth2Service],
})
export class Oauth2Module {}
