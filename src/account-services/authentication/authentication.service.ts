import { Injectable, Inject, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { AuthPayload } from './interfaces/auth-payload.interface';
import { PermissionsService } from 'src/permissions/permissions.service';
import { User } from 'src/users/entities/user.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthenticationService {
	constructor(
		private jwtService: JwtService,
		private readonly usersService: UsersService,
		private readonly permissionsService: PermissionsService,
		@Inject('CACHE_MANAGER') private cacheManager: Cache
	) {}

	async login(loginDto: LoginDto): Promise<any> {
		const user = await this.validateUser(loginDto.username, loginDto.password);
		const payload: AuthPayload = { 
			name: user.fullname,
			id: user.id
		};

		if(!await this.cacheManager.get(user.id.toString())) {
			const userPermissions = await this.permissionsService.getPermissionByUserId(user.id);
			await this.cacheManager.set(user.id.toString(), userPermissions.toString());
			console.log(await this.cacheManager.get(user.id.toString()))
		}
		
		return this.jwtService.sign(payload);
	}

	async validateUser(username: string, password: string): Promise<User> {
		const user = await this.usersService.findByUsername(username);
		if (!user) {
			return null;
		}

		const passwordValid = await bcrypt.compare(password, user.password);
		if (!passwordValid) {
			return null;
		}

		return user;
	}

	async validateGoogleUser(email: string, name: string) {
		
	}
}
