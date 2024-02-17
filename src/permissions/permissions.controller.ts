import {
	Controller,
	Get,
	Param,
	Delete,
	Body,
	Post,
	UseGuards,
	SetMetadata,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { createPermissionDto } from './dto/create-permission.dto';
import { PermissionGuard } from 'src/account-services/authentication/guards/permissions.guard';
import { JwtAuthGuard } from 'src/account-services/authentication/guards/jwt.guard';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
	constructor(private readonly permissionsService: PermissionsService) {}

	@UseGuards(JwtAuthGuard, PermissionGuard)
	@SetMetadata('permissions', ['create:permissions'])
	@ApiBearerAuth('JWT-auth')
	@Post()
	create(@Body() createPermissionDto: createPermissionDto) {
		return this.permissionsService.create(createPermissionDto);
	}

	@UseGuards(JwtAuthGuard, PermissionGuard)
	@SetMetadata('permissions', ['read:permissions'])
	@ApiBearerAuth('JWT-auth')
	@Get()
	findAll() {
		return this.permissionsService.findAll();
	}

	@UseGuards(JwtAuthGuard, PermissionGuard)
	@SetMetadata('permissions', ['read:permissions'])
	@ApiBearerAuth('JWT-auth')
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.permissionsService.findOne(+id);
	}

	@UseGuards(JwtAuthGuard, PermissionGuard)
	@SetMetadata('permissions', ['delete:permissions'])
	@ApiBearerAuth('JWT-auth')
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.permissionsService.remove(+id);
	}

	@UseGuards(JwtAuthGuard, PermissionGuard)
	@SetMetadata('permissions', ['assign:permissions'])
	@ApiBearerAuth('JWT-auth')
	@Post('assign')
	assignPermission(@Body() assignPermissionDto: AssignPermissionDto) {
		return this.permissionsService.assignPermission(assignPermissionDto);
	}
}
