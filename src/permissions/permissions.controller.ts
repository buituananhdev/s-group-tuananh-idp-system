import {
	Controller,
	Get,
	Param,
	Delete,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
	constructor(private readonly permissionsService: PermissionsService) {}

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
}
