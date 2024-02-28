import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { In, Repository } from 'typeorm';
import { AssignRoleDto } from './dto/assign-role.dto';
import { UsersService } from 'src/users/users.service';
import { Permission } from 'src/permissions/entities/permission.entity';
import { Cache } from 'cache-manager';
import { PermissionsService } from 'src/permissions/permissions.service';

@Injectable()
export class RolesService {
	constructor(
		@InjectRepository(Role)
		private readonly roleRepository: Repository<Role>,
		private readonly userServices: UsersService,
		@Inject('CACHE_MANAGER') private cacheManager: Cache
	) {}

	async create(createRoleDto: CreateRoleDto) {
		const role = this.roleRepository.create(createRoleDto);
		return await this.roleRepository.save(role);
	}

	async findAll() {
		return await this.roleRepository.find();
	}

	async findOne(query: any) {
		const role = await this.roleRepository.findOne(query);
		if (!role) {
			throw new NotFoundException('Role not found');
		}
		return role;
	}

	async findByRolesNameAndGetRalatedPermission(roles: string[]) {
		const rolesWithPermissions = await this.roleRepository.find({ where: { name: In(roles) }, relations: ['permissions'] });
		if (!rolesWithPermissions) {
			throw new NotFoundException('Role not found');
		}
		return rolesWithPermissions;
	}

	async update(id: number, updateRoleDto: UpdateRoleDto) {
		const role = await this.findOne({ where: { id }});

		Object.assign(role, updateRoleDto);
		return await this.roleRepository.update(id,role);
	}

	async updatePermissions(id: number, permissions: Permission[]) {
		const role = await this.roleRepository.findOneOrFail({ where: { id } });
		this.roleRepository.merge(role, { permissions });
		return await this.roleRepository.update(id, role);
	}

	async remove(id: number) {
		const role = await this.roleRepository.findOne({
			where: { id },
		});
		if (!role) {
			throw new NotFoundException();
		}
		return await this.roleRepository.remove(role);
	}

	async assignRole(assignRoleDto: AssignRoleDto) {
		const { userId, roles } = assignRoleDto;
		const user = await this.userServices.findById(userId);
		if (!user) {
			throw new NotFoundException('User not found');
		}
		user.roles = await this.roleRepository.findByIds(roles);
		await this.userServices.updateRoles(user.id, user.roles);


		// update cache
		if(this.cacheManager.get(userId.toString())) {
			await this.cacheManager.del(userId.toString());
		}
		return user;
	}
}
