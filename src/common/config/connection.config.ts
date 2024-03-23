import dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { join } from 'path';

dotenv.config();

export const connectionConfig: TypeOrmModuleOptions = {
	type: 'postgres',
	host: process.env.DB_HOST,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	port: parseInt(process.env.DB_PORT),
	database: process.env.DB_NAME,
	entities: [join(process.cwd(), 'dist/**/*.entity.js')],
	synchronize: true,
	logging: true,
	migrationsRun: true,
};
