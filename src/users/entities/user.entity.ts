import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ unique: true })
    username: string;
    @Column({ type: "text" })
    password: string;
    @Column({ type: "text" })
    fullname: string;
    @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    @Column({ type: 'date', nullable: true, default: null })
    updatedAt: Date;
}
