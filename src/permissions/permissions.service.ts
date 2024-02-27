import { Injectable, NotFoundException } from '@nestjs/common';
import { Permission } from './entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { RolesService } from 'src/roles/roles.service';
import { createPermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionsService {
	constructor(
		@InjectRepository(Permission)
		private readonly userRepository: Repository<Permission>,
		private readonly roleService: RolesService,
	) {}
	async create(createPermissionDto: createPermissionDto) {
		const permission = this.userRepository.create(createPermissionDto);
		return await this.userRepository.save(permission);
	}

	async findAll() {
		return await this.userRepository.find();
	}

	async findOne(id: number) {
		return await this.userRepository.findOne({
			where: { id },
		});
	}

	async update(id: number, updatePermissionDto: Permission) {
		const permission = await this.userRepository.findOne({
			where: { id },
		});
		if (!permission) {
			throw new NotFoundException();
		}
		Object.assign(permission, updatePermissionDto);

		return await this.userRepository.save(permission);
	}

	async remove(id: number) {
		const permission = await this.userRepository.findOne({
			where: { id },
		});
		if (!permission) {
			throw new NotFoundException();
		}
		return await this.userRepository.remove(permission);
	}

	async assignPermission(assignPermissionDto: AssignPermissionDto) {
		const { roleId, permissions } = assignPermissionDto;
		const role = await this.roleService.findOne({ where: { id: roleId } });
		const assignedPermissions = await this.userRepository.findByIds(permissions);
		role.permissions = assignedPermissions;
		await this.roleService.updatePermissions(role.id, role.permissions);
	}

	async getPermissionByRolesName(roles: string[]) {
		const rolePermissionMap: Record<string, string[]> = {};

		const rolesWithPermissions = await this.roleService.findByRolesNameAndGetRalatedPermission(roles);
    
		// Organize the data into a map for easier lookup
		rolesWithPermissions.forEach((role) => {
			rolePermissionMap[role.name] = role.permissions.map(
				(permission) => permission.name,
			);
		});

    return roles.flatMap((roleName) => rolePermissionMap[roleName] || []);
	}
}
