import { OAuth2Client } from "src/account-services/oauth2/entities/oauth2-client";
import { Role } from "src/roles/entities/role.entity";
import { Column, Entity, ManyToMany, JoinTable, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ unique: true })
    username: string;
    @Column({ unique: true })
    email: string;
    @Column({ type: "text" })
    password: string;
    @Column({ type: "text" })
    fullname: string;
    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    @Column({ type: 'timestamptz', nullable: true, default: null })
    updatedAt: Date;

    @ManyToMany(() => Role, (role) => role.users, { cascade: true, eager: true })
    @JoinTable({
        name: "user_roles",
        joinColumn: { name: "user_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "role_id", referencedColumnName: "id" }
    })
    roles?: Role[];
    
    @OneToMany(() => OAuth2Client, oauth2Client => oauth2Client.user)
    oauth2Clients: OAuth2Client[];
}
