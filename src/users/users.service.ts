import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (await this.userRepository.findOne({ where: { username: createUserDto.username } })) {
      throw new NotFoundException('User already exists');
    }
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);
    const user = this.userRepository.create({ ...createUserDto, password: hash });
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(query?: any): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail(query);
      return user;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneOrFail({ where: { id } });
    this.userRepository.merge(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async updateRoles(id: number, roles: Role[]): Promise<User> {
    const user = await this.userRepository.findOneOrFail({ where: { id } });
    this.userRepository.merge(user, { roles });
    return await this.userRepository.save(user);
  }
  
  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOneOrFail({ where: { id } });
    await this.userRepository.remove(user);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { username } });
  }
}
