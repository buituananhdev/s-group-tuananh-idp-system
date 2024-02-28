import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { InternalServerErrorException } from 'src/common/exceptions';

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(private readonly configService: ConfigService) {}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();

		const token = request.headers.authorization?.split(' ')[1];        
		if (!token) {
            return false;
		}

        try {
            const secretKey = this.configService.get<string>('JWT_SECRET');
            const decoded = jwt.verify(token, secretKey);
            request.user = decoded;
        } catch (error) {
            throw new InternalServerErrorException();
        }

        return true;
	}
}
