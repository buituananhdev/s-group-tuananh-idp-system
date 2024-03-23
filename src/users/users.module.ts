import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { OAuth2Client } from 'src/account-services/oauth2/entities/oauth2-client';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, OAuth2Client]),
    forwardRef(() => PermissionsModule),
    forwardRef(() => RolesModule),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRATION') },
      }),
    })
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
