import { BadRequestException } from '@nestjs/common';
import { ErrorCodeEnum } from '../enums/index'

export class UserAlreadyExistsException extends BadRequestException {
	constructor() {
		super(ErrorCodeEnum.USER_ALREADY_EXISTS, 'USER_ALREADY_EXISTS');
	}
}
