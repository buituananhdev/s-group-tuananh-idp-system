import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
	Headers,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Identified, Permission } from 'src/common/decorators/index';
import { PermissionEnum } from 'src/common/enums/index';
import { AuthUser } from 'src/common/decorators/user.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('seed')
	seedUsers() {
		return this.usersService.seedUsers();
	}
	
	@Identified
	@Get('me')
	getMe(@Headers('Authorization') auth: string) {
		return this.usersService.getMe(auth);
	}

	// @Identified
	// @Permission([PermissionEnum.CREATE_USERS])
	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	// @Identified
	// @Permission([PermissionEnum.READ_USERS])
	@Get()
	findAll(
		@Query('page') page: number = 1,
        @Query('limit') limit: number = 20,
        @Query('search') search?: string,
        @Query('name') exactName?: string,
        @Query('email') exactEmail?: string,
        @Query('fromDate') fromDate?: Date,
        @Query('toDate') toDate?: Date,
	) {
		return this.usersService.findAll(page, limit, search, exactName, exactEmail, fromDate, toDate);
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
