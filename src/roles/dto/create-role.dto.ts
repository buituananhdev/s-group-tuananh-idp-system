import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRoleDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Name must not be empty' })
    @IsString({ message: 'Name must be a string' })
    @MaxLength(50, { message: 'Name cannot be longer than 50 characters' })
    name: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Description must not be empty' })
    @IsString({ message: 'Description must be a string' })
    @MaxLength(255, { message: 'Description cannot be longer than 255 characters' })
    description: string;
}
