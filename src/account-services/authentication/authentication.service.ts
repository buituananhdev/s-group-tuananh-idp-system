import { Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { AuthPayload } from './interfaces/auth-payload.interface';
import { PermissionsService } from 'src/permissions/permissions.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthenticationService {
	constructor(
		private jwtService: JwtService,
		private readonly usersService: UsersService
	) {}

	async login(loginDto: LoginDto): Promise<any> {
		const user = await this.validateUser(loginDto.username, loginDto.password);
		const payload: AuthPayload = { 
			name: user.fullname,
			id: user.id
		};
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
}
