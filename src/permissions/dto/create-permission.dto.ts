import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Name must not be empty' })
    @IsString({ message: 'Name must be a string' })
    name: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Description must not be empty' })
    @IsString({ message: 'Description must be a string' })
    description: string;
}
