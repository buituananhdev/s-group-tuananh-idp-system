import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import { AuthPayload } from '../interfaces/auth-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET,
		});
	}

	async validate(payload: AuthPayload) {
		console.log('payload', payload);
		return payload;
	}
}
