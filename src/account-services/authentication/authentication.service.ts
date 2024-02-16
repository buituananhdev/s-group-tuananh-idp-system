import { Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthenticationService {
	constructor(
		private jwtService: JwtService,
		private readonly usersService: UsersService
	) {}

	async login(loginDto: LoginDto): Promise<string> {
		const user = await this.validateUser(loginDto.username, loginDto.password);
		return this.jwtService.sign({ code: user.id });
	}

	async validateUser(username: string, password: string): Promise<any> {
		const user = await this.usersService.findByUsername(username);

		if (!user) {
			throw new NotFoundException('User not found');
		}

		const passwordValid = await bcrypt.compare(password, user.password);

		if (!passwordValid) {
			throw new UnauthorizedException('Invalid password');
		}

		return user;
	}
}
