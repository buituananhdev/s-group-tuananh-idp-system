import { ApiProperty } from "@nestjs/swagger";

export class createPermissionDto {
    @ApiProperty()
    name: string;
    @ApiProperty()
    description: string;
}
