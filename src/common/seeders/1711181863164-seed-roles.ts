import { In, MigrationInterface, QueryRunner } from "typeorm";
import { SystemRoles } from "../enums/role.enum";
import { Role } from "src/roles/entities/role.entity";
import { PermissionEnum } from "../enums";
import { Permission } from "../decorators";

export class  $npmConfigName1711181863164 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const roleRepository = queryRunner.manager.getRepository(Role);
        const permissionRepository = queryRunner.manager.getRepository(Permission);

        const savedRoles = await roleRepository.save([
            {
                name: SystemRoles.SUPER_ADMIN,
                description: 'Super admin of the system',
                isEditable: false,
                createdAt: new Date(),
                updatedAt: new Date(Date.now() + Math.random() * 1000)
            },
            {
                name: SystemRoles.COACHING,
                description: 'Coach of the system',
                isEditable: true,
                createdAt: new Date(),
                updatedAt: new Date(Date.now() + Math.random() * 1000)
            },
            {
                name: SystemRoles.ADMIN,
                description: 'Admin of the system',
                isEditable: true,
                createdAt: new Date(),
                updatedAt: new Date(Date.now() + Math.random() * 1000)
            },
        ]);
        const savedPermissions = await permissionRepository.save([
            {
                name: PermissionEnum.READ_USERS,
                description: 'View users of system',
            },
            {
                name: PermissionEnum.CREATE_USERS,
                description: 'Create users of system',
            },
            // Add other permissions here
        ]);
        const nameMapToRoles = savedRoles.reduce((acc, role) => {
            acc[role.name] = role;
            return acc;
        }, {});

        const nameMapToPermissions = savedPermissions.reduce((acc, permission) => {
            acc[permission.name] = permission;
            return acc;
        }, {});

        const roleNameMapToPermissionNames = {
            [SystemRoles.SUPER_ADMIN]: Object.values(PermissionEnum),
            [SystemRoles.ADMIN]: [
                PermissionEnum.READ_USERS,
                PermissionEnum.READ_ROLES,
            ],
            [SystemRoles.COACHING]: [],
        };

        await roleRepository.save(
            Object.keys(roleNameMapToPermissionNames).map((roleName) => {
                const role = nameMapToRoles[roleName];

                role.permissions = roleNameMapToPermissionNames[roleName].map(
                    (permissionName) => nameMapToPermissions[permissionName],
                );

                return role;
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const roleRepository = queryRunner.manager.getRepository(Role);
        await roleRepository.delete({
            name: In(Object.values(SystemRoles)),
        });
    }

}
