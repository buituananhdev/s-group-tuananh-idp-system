import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOauth2Dto } from './dto/create-oauth2.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuth2Client } from './entities/oauth2-client';
import { Not, Repository } from 'typeorm';
import {
	InternalServerErrorException,
} from 'src/common/exceptions/index';
import { LoginDto } from '../authentication/dto/login.dto';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable()
export class Oauth2Service {
  constructor(
    @InjectRepository(OAuth2Client)
    private readonly oauth2Repository: Repository<OAuth2Client>,
    private readonly authenticationService: AuthenticationService
  ) {}
  async login(LoginDto: LoginDto) {
    const token = await this.authenticationService.login(LoginDto);

  }

  async checkClient(client_id: string, redirect_uri: string) {
    const client = await this.oauth2Repository.findOne({ where: { client_id: client_id} });
      if(!client) {
        throw new NotFoundException('Client not found');
      }

      if(client.redirect_uri !== redirect_uri) {
        throw new BadRequestException('Invalid Redirect URI');
      }
      return client.name;
  }

  async create(createOauth2Dto: CreateOauth2Dto) {
    try {
      const oauth2 = this.oauth2Repository.create(createOauth2Dto);
      return await this.oauth2Repository.insert(oauth2);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
