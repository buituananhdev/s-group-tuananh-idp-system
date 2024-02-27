import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Identified, Permission } from 'src/common/decorators/index';
import { PermissionEnum } from 'src/common/enums/index';

@ApiTags('Users')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Identified
	@Permission([PermissionEnum.CREATE_USERS])
	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@Identified
	@Permission([PermissionEnum.READ_USERS])
	@Get()
	findAll(@Param('page') page: number, @Param('limit') limit: number) {
		return this.usersService.findAll(page, limit);
	}

	@Identified
	@Permission([PermissionEnum.READ_USERS])
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.usersService.findById(+id);
	}

	@Identified
	@Permission([PermissionEnum.UPDATE_USERS])
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(+id, updateUserDto);
	}

	@Identified
	@Permission([PermissionEnum.DELETE_USERS])
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.usersService.remove(+id);
	}

	@Identified
	@Permission([PermissionEnum.READ_USERS])
	@Get(':id/roles')
	getRoles(@Param('id') id: string) {
		return this.usersService.getRolesByUserId(+id);
	}
}
