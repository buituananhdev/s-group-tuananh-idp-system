import {
	Controller,
	Get,
	Param,
	Delete,
	Body,
	Post,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { ApiTags } from '@nestjs/swagger';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { createPermissionDto } from './dto/create-permission.dto';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
	constructor(private readonly permissionsService: PermissionsService) {}

	@Post()
	create(@Body() createPermissionDto: createPermissionDto) {
		return this.permissionsService.create(createPermissionDto);
	}
	@Get()
	findAll() {
		return this.permissionsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.permissionsService.findOne(+id);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.permissionsService.remove(+id);
	}

	@Post('assign')
	assignPermission(@Body() assignPermissionDto: AssignPermissionDto) {
		return this.permissionsService.assignPermission(assignPermissionDto);
	}
}
