import { Module, forwardRef } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { PermissionsModule } from 'src/permissions/permissions.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => PermissionsModule),
    TypeOrmModule.forFeature([Role]),
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService]
})
export class RolesModule {}
