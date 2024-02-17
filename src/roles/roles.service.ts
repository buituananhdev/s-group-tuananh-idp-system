import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { AssignRoleDto } from './dto/assign-role.dto';
import { UsersService } from 'src/users/users.service';
import { Permission } from 'src/permissions/entities/permission.entity';
@Injectable()
export class RolesService {
	constructor(
		@InjectRepository(Role)
		private readonly roleRepository: Repository<Role>,
		private readonly userServices: UsersService,
	) {}
	async create(createRoleDto: CreateRoleDto) {
		const role = this.roleRepository.create(createRoleDto);
		return await this.roleRepository.save(role);
	}

	async findAll() {
		return await this.roleRepository.find();
	}

	async findOne(query: any) {
    try {
      const role = await this.roleRepository.findOne(query);
      if (!role) {
        throw new NotFoundException('Role not found');
      }
      return role;
    } catch (error) {
      throw new NotFoundException('Role not found');
    }
	}

	async update(id: number, updateRoleDto: UpdateRoleDto) {
		const role = await this.roleRepository.findOne({
			where: { id },
		});
		if (!role) {
			throw new NotFoundException();
		}
		Object.assign(role, updateRoleDto);

		return await this.roleRepository.save(role);
	}

  async updatePermissions(id: number, permissions: Permission[]) {
		const role = await this.roleRepository.findOneOrFail({ where: { id } });
    this.roleRepository.merge(role, { permissions });
    return await this.roleRepository.save(role);
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
		const user = await this.userServices.findOne({ where: { id: userId } });
		const assignedRoles = await this.roleRepository.findByIds(roles);
		user.roles = assignedRoles;
		await this.userServices.updateRoles(user.id, user.roles);
		return user;
	}

	async getRolesByUserId(userId: number): Promise<Role[]> {
		const user = await this.userServices.findOne({
			where: { id: userId },
			relations: ['roles'],
		});

		return user.roles;
	}
}
