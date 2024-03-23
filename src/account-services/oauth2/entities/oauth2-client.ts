import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "oauth2_clients" })
export class OAuth2Client {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    client_id: string;

    @Column()
    client_secret: string;

    @Column()
    redirect_uri: string;

    @Column()
    grant_types: string;

    @Column()
    scope: string;

    @ManyToOne(() => User, user => user.oauth2Clients)
    user: User;
}
