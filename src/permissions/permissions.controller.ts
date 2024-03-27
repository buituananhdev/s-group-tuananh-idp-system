import {
	Controller,
	Get,
	Param,
	Delete,
	Body,
	Post
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { ApiTags } from '@nestjs/swagger';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Identified, Permission } from 'src/common/decorators/index';
import { PermissionEnum } from 'src/common/enums/index';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
	constructor(private readonly permissionsService: PermissionsService) {}

	@Get('seed')
	seedPermissions() {
		return this.permissionsService.seedPermissions();
	}
	
	@Identified
	@Permission([PermissionEnum.CREATE_PERMISSIONS])
	@Post()
	create(@Body() CreatePermissionDto: CreatePermissionDto) {
		return this.permissionsService.create(CreatePermissionDto);
	}

	@Identified
	@Permission([PermissionEnum.READ_PERMISSIONS])
	@Get()
	findAll() {
		return this.permissionsService.findAll();
	}

	@Identified
	@Permission([PermissionEnum.READ_PERMISSIONS])
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.permissionsService.findOne(+id);
	}

	@Identified
	@Permission([PermissionEnum.DELETE_PERMISSIONS])
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.permissionsService.remove(+id);
	}

	@Identified
	@Permission([PermissionEnum.ASSIGN_PERMISSIONS])
	@Post('assign')
	assignPermission(@Body() assignPermissionDto: AssignPermissionDto) {
		return this.permissionsService.assignPermission(assignPermissionDto);
	}

	
}
