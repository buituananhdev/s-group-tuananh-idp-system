import { ApiProperty } from "@nestjs/swagger";

export class AssignRoleDto {
    @ApiProperty()
    userId: number;
    @ApiProperty()
    roles: number[];
}
