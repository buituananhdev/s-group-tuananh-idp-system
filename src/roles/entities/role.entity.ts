import { Permission } from "src/permissions/entities/permission.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";

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

    @ManyToMany(() => Permission, (permission) => permission.roles, { cascade: true, eager: true })
    @JoinTable({
        name: "role_permissions",
        joinColumn: { name: "role_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "permission_id", referencedColumnName: "id" }
    })
    permissions: Permission[];
    users: any;
}
