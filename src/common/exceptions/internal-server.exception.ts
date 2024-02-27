import { InternalServerErrorException as NestInternalServerErrorException } from '@nestjs/common';
import { ErrorCodeEnum } from '../enums/index';

export class InternalServerErrorException extends NestInternalServerErrorException {
	constructor() {
		super(ErrorCodeEnum.INTERNAL_SERVER_ERROR, 'INTERNAL_SERVER_ERROR');
	}
}
