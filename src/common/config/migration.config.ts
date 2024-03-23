import { DataSource } from 'typeorm';
import { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions';
import { connectionConfig } from './connection.config';
import { join } from 'path';

const MIGRATION_CONFIGS = {
	migrations: [join(__dirname, '../migrations/*{.ts,.js}')],
	migrationsTableName: 'migrations',
};

export default new DataSource({
	...connectionConfig,
	...MIGRATION_CONFIGS,
} as DataSourceOptions);
