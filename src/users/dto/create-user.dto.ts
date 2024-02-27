import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	username: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@Length(8, 32, {
		message: 'Password must be between 8 and 32 characters long',
	})
	password: string;

	@ApiProperty()
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	fullname: string;
}
