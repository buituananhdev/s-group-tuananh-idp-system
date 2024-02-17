import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { PermissionsController } from './permissions.controller';
import { Role } from 'src/roles/entities/role.entity';
import { RolesService } from 'src/roles/roles.service';
import { RolesModule } from 'src/roles/roles.module';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    UsersModule,
    RolesModule,
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Role]),
    TypeOrmModule.forFeature([Permission])
  ],
  providers: [PermissionsService, RolesService, UsersService],
  controllers: [PermissionsController],
})
export class PermissionsModule {}
