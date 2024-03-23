import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { In, MigrationInterface, QueryRunner } from 'typeorm';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { SystemRoles } from '../enums/role.enum';

export class $npmConfigName1711212638614 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const userRepository = queryRunner.manager.getRepository(User);
		const roleRepository = queryRunner.manager.getRepository(Role);

		const roles = await roleRepository.find({ where: { name: In([SystemRoles.COACHING, SystemRoles.ADMIN]) } });
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
				roles: [roles[Math.floor(Math.random() * 2)]],
			};
			const user = userRepository.create(userDto);
			await userRepository.save(user);
		}
	}

	public async down(queryRunner: QueryRunner): Promise<void> {}
}
