import { ApiProperty } from "@nestjs/swagger";

export class CreateOauth2Dto {
    @ApiProperty()
    name: string;
    @ApiProperty()
    client_id: string;
    @ApiProperty()
    client_secret: string;
    @ApiProperty()
    redirect_uri: string;
    @ApiProperty()
    grant_types: string;
    @ApiProperty()
    scope: string;
}
