import { ApiProperty } from "@nestjs/swagger";

export class AssignPermissionDto {
    @ApiProperty()
    roleId: number;
    @ApiProperty()
    permissions: number[];
}
