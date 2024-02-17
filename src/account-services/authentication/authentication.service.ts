import { Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { AuthPayload } from './interfaces/auth-payload.interface';
import { PermissionsService } from 'src/permissions/permissions.service';

@Injectable()
export class AuthenticationService {
	constructor(
		private jwtService: JwtService,
		private readonly usersService: UsersService,
		private readonly permissionsService: PermissionsService
	) {}

	async login(loginDto: LoginDto): Promise<any> {
		const user = await this.validateUser(loginDto.username, loginDto.password);
		const userPermissions = await this.permissionsService.getPermissionByRolesName(user.roles.map(role => role.name));
		const payload: AuthPayload = { 
			name: user.id,
			email: user.username,
			id: user.id,
			permissions: userPermissions
		};
		return this.jwtService.sign(payload);
	}

	async validateUser(username: string, password: string): Promise<any> {
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
}
