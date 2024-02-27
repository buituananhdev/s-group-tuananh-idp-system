import { NotFoundException } from '@nestjs/common';
import { ErrorCodeEnum } from '../enums/index';

export class UserNotFoundException extends NotFoundException {
	constructor() {
		super(ErrorCodeEnum.USER_NOT_FOUND, 'USER_NOT_FOUND');
	}
}
