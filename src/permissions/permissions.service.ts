import { Injectable, NotFoundException } from '@nestjs/common';
import { Permission } from './entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { RolesService } from 'src/roles/roles.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { InternalServerErrorException } from 'src/common/exceptions';
import { UsersService } from 'src/users/users.service';
import { PermissionEnum } from 'src/common/enums/permission.enum';

@Injectable()
export class PermissionsService {
	constructor(
		@InjectRepository(Permission)
		private readonly permissionRepository: Repository<Permission>,
		private readonly roleService: RolesService,
		private readonly userService: UsersService,
	) {}

	async seedPermissions() {
		const permissions = [
			{ name: PermissionEnum.READ_USERS, description: 'Read Users' },
			{ name: PermissionEnum.CREATE_USERS, description: 'Create Users' },
			{ name: PermissionEnum.UPDATE_USERS, description: 'Update Users' },
			{ name: PermissionEnum.DELETE_USERS, description: 'Delete Users' },
			{ name: PermissionEnum.READ_ROLES, description: 'Read Roles' },
			{ name: PermissionEnum.CREATE_ROLES, description: 'Create Roles' },
			{ name: PermissionEnum.UPDATE_ROLES, description: 'Update Roles' },
			{ name: PermissionEnum.DELETE_ROLES, description: 'Delete Roles' },
			{ name: PermissionEnum.READ_PERMISSIONS, description: 'Read Permissions' },
			{ name: PermissionEnum.CREATE_PERMISSIONS, description: 'Create Permissions' },
			{ name: PermissionEnum.UPDATE_PERMISSIONS, description: 'Update Permissions' },
			{ name: PermissionEnum.DELETE_PERMISSIONS, description: 'Delete Permissions' },
			{ name: PermissionEnum.ASSIGN_PERMISSIONS, description: 'Assign Permissions' },
			{ name: PermissionEnum.ASSIGN_ROLES, description: 'Assign Roles' }
		];
	
		for (const permissionData of permissions) {
			const permission = this.permissionRepository.create(permissionData);
			await this.permissionRepository.save(permission);
		}
	}
	
	async create(CreatePermissionDto: CreatePermissionDto) {
		const permission = this.permissionRepository.create(CreatePermissionDto);
		return await this.permissionRepository.save(permission);
	}

	async findAll() {
		return await this.permissionRepository.find();
	}

	async findOne(id: number) {
		return await this.permissionRepository.findOne({
			where: { id },
		});
	}

	async update(id: number, updatePermissionDto: Permission) {
		const permission = await this.permissionRepository.findOne({
			where: { id },
		});
		if (!permission) {
			throw new NotFoundException();
		}
		Object.assign(permission, updatePermissionDto);

		return await this.permissionRepository.save(permission);
	}

	async remove(id: number) {
		const permission = await this.permissionRepository.findOne({
			where: { id },
		});
		if (!permission) {
			throw new NotFoundException();
		}
		return await this.permissionRepository.remove(permission);
	}

	async assignPermission(assignPermissionDto: AssignPermissionDto) {
		const { roleId, permissions } = assignPermissionDto;
		const role = await this.roleService.findOne({ where: { id: roleId } });
		const assignedPermissions = await this.permissionRepository.findByIds(permissions);
		role.permissions = assignedPermissions;
		await this.roleService.updatePermissions(role.id, role.permissions);
	}

	async getPermissionByUserId(userId: number) {
		try {
			const user = await this.userService.findById(userId);
			const userRoles = user.roles.map(role => role.name);
			const rolePermissionMap: Record<string, string[]> = {};
			const rolesWithPermissions = await this.roleService.findByRolesNameAndGetRalatedPermission(userRoles);

			rolesWithPermissions.forEach((role) => {
				rolePermissionMap[role.name] = role.permissions.map(
					(permission) => permission.name,
				);
			});

			return userRoles.flatMap((roleName) => rolePermissionMap[roleName] || []);
		} catch (err) {
			throw new InternalServerErrorException();
		}
	}
}
