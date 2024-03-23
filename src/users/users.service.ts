import { BadRequestException, Injectable } from '@nestjs/common';
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
import { JwtService } from '@nestjs/jwt';
import { faker } from '@faker-js/faker';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
	) {}

	async seedUsers() {
		const roles = [
			{
				id: 2,
				name: 'Admin',
				description: 'Admin',
				isEditable: true,
				createdAt: '2024-03-23T08:41:23.336Z',
				updatedAt: null,
				permissions: [],
			},
			{
				id: 3,
				name: 'Coaching',
				description: 'COACHING',
				isEditable: true,
				createdAt: '2024-03-23T08:41:23.341Z',
				updatedAt: null,
				permissions: [],
			},
		];
		for (let i = 0; i < 1000; i++) {
			const randomUpdatedAt = faker.date.past();
			const randomUsername = faker.internet.userName();
			const randomFullname = faker.internet.userName();
			const randomPassword = faker.internet.password();
			const ramdomEmail = faker.internet.email();

			const salt = await bcrypt.genSalt(10);
			const hash = await bcrypt.hash(randomPassword, salt);

			const userDto = {
				username: randomUsername,
				email: ramdomEmail,
				password: hash,
				fullname: randomFullname,
				createdAt: new Date(),
				updatedAt: randomUpdatedAt,
				roles: roles,
			};
			const user = this.userRepository.create(userDto);
			await this.userRepository.save(user);
		}
	}

	async create(createUserDto: CreateUserDto): Promise<User> {
		try {
			const salt = await bcrypt.genSalt(10);
			const hash = await bcrypt.hash(createUserDto.password, salt);

			const user = this.userRepository.create({
				...createUserDto,
				password: hash,
			});
			return await this.userRepository.save(user);
		} catch (error) {
			console.log(error);
			throw new InternalServerErrorException();
		}
	}

	isNumber(value: any): boolean {
		return typeof value === 'number' && !isNaN(value);
	}

	async findAll(
		page: number = 1,
		limit: number = 20,
		search?: string,
		name?: string,
		email?: string,
		fromDate?: Date,
		toDate?: Date,
	): Promise<{ data: User[]; meta: Meta }> {

		const queryBuilder = this.userRepository.createQueryBuilder('user');

		if (search) {
			queryBuilder.andWhere(
				'(user.fullname LIKE :search OR user.email LIKE :search)',
				{ search: `%${search}%` },
			);
		}

		if (name) {
			queryBuilder.andWhere('user.username = :name', { name });
		}

		if (email) {
			queryBuilder.andWhere('user.email = :email', { email });
		}

		if (fromDate && toDate) {
			queryBuilder.andWhere('user.updatedAt BETWEEN :fromDate AND :toDate', {
				fromDate,
				toDate,
			});
		}

		const [data, total] = await queryBuilder
			.skip((page - 1) * limit)
			.take(limit)
			.getManyAndCount();

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
		const user = await this.userRepository.findOne({
			where: { username: username },
		});
		if (!user) {
			throw new UserNotFoundException();
		}
		return user;
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

	async getMe(token: string): Promise<User> {
		const decoded = await this.jwtService.verifyAsync(
			token.replace('Bearer ', ''),
		);
		const user = await this.userRepository.findOneOrFail({
			where: { id: decoded.id },
		});
		return user;
	}
}
