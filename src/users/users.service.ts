import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/roles/entities/role.entity';
import { ConfigService } from '@nestjs/config';
import { Meta } from 'src/common/types/index';
import {
	UserAlreadyExistsException,
	UserNotFoundException,
	InternalServerErrorException,
} from 'src/common/exceptions/index';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly configService: ConfigService,
	) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		try {
			if (await this.findByUsername(createUserDto.username)) {
				throw new UserAlreadyExistsException();
			}

			const hash = await bcrypt.hash(
				createUserDto.password,
				this.configService.get('BCRYPT_ROUND'),
			);

			const user = this.userRepository.create({
				...createUserDto,
				password: hash,
			});
			return await this.userRepository.save(user);
		} catch (error) {
			throw new InternalServerErrorException();
		}
	}

	async findAll(page = 1, limit = 10): Promise<{ data: User[]; meta: Meta }> {
		try {
			const [data, total] = await this.userRepository.findAndCount({
				skip: (page - 1) * limit,
				take: limit,
			});
			const totalPage = Math.ceil(total / limit);
			const nextPage = page < totalPage ? page + 1 : null;

			return {
				data,
				meta: {
					currentPage: page,
					nextPage,
					totalPage,
				},
			};
		} catch (error) {
			throw new InternalServerErrorException();
		}
	}

	async findById(id: number): Promise<User> {
		try {
			const user = await this.userRepository.findOneOrFail({ where: { id } });
			return user;
		} catch (error) {
			throw new UserNotFoundException();
		}
	}

	async findByUsername(username: string): Promise<User> {
		try {
			const user = await this.userRepository.findOneOrFail({
				where: { username: username },
			});
			if (!user) {
				throw new UserNotFoundException();
			}
			return user;
		} catch (error) {
			throw new InternalServerErrorException();
		}
	}

	async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
		try {
			await this.userRepository.update(id, {
				username: updateUserDto.username,
				fullname: updateUserDto.fullname,
			});
			const user = await this.findById(id);
			return user;
		} catch (error) {
			throw new InternalServerErrorException();
		}
	}

	async updateRoles(id: number, roles: Role[]): Promise<User> {
		try {
			const user = await this.userRepository.findOneOrFail({ where: { id } });
			this.userRepository.merge(user, { roles });
			return await this.userRepository.save(user);
		} catch (error) {
			throw new InternalServerErrorException();
		}
	}

	async remove(id: number): Promise<void> {
		try {
			const user = await this.userRepository.findOneOrFail({ where: { id } });
			// What happens with the related data, should it be removed as well?
			await this.userRepository.remove(user);
		} catch (error) {
			throw new InternalServerErrorException();
		}
	}

	async getRolesByUserId(userId: number): Promise<Role[]> {
		try {
			const user = await this.userRepository.findOne({
				where: { id: userId },
				relations: ['roles'],
			});

			return user.roles;
		} catch (error) {
			throw new InternalServerErrorException();
		}
	}
}
