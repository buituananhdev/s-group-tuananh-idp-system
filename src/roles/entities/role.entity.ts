import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "roles" })
export class Role {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: "text", unique: true })
    name: string;
    @Column({ type: "text" })
    description: string;
    @Column({ type: "boolean", default: "true"})
    isEditable: boolean;
    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    @Column({ type: 'timestamptz', nullable: true, default: null })
    updatedAt: Date;
}
