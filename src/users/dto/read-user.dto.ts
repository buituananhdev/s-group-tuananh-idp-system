import { Role } from "src/roles/entities/role.entity";

export class ReadUserDto {
    id: number;
    username: string;
    fullname: string;
    createdAt: Date;
    updatedAt: Date;
    roles: Role[];
}