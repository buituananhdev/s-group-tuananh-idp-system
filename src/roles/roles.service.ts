import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { AssignRoleDto } from './dto/assign-role.dto';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly userServices: UsersService
    ) {}
  async create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepository.create(createRoleDto);
    return await this.roleRepository.save(role);
  }

  async findAll() {
    return await this.roleRepository.find();
  }

  async findOne(id: number) {
    return await this.roleRepository.findOne({
      where: { id }
    });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepository.findOne({
      where: { id }
    });
    if(!role) {
      throw new NotFoundException();
    }
    Object.assign(role, updateRoleDto);

    return await this.roleRepository.save(role);  
  }

  async remove(id: number) {
    const role = await this.roleRepository.findOne({
      where: { id }
    });
    if(!role) {
      throw new NotFoundException();
    }
    return await this.roleRepository.remove(role);
  }

  async assignRole(assignRoleDto: AssignRoleDto) {
    const user = await this.userServices.findOne(assignRoleDto.userId);
    if (!user) {
      throw new NotFoundException(`User with id ${assignRoleDto.userId} not found`);
    }
  
    const roles = await this.roleRepository.findByIds(assignRoleDto.roles);
  
    if (roles.length !== assignRoleDto.roles.length) {
      throw new NotFoundException(`One or more roles not found`);
    }
  
    user.roles = [...new Set([...user.roles, ...roles])]; // Use Set to ensure uniqueness
    await this.userServices.updateRoles(assignRoleDto.userId, user.roles);
  }
}
