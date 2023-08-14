import { DataSourceOptions } from 'typeorm';

const config: DataSourceOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || "3306"),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: true,
    relationLoadStrategy: process.env.DB_RELATION_LOAD_STRATEGY === 'join' ? 'join' : 'query',
    entities: ['src/typeorm/entities/*.ts'],
    migrations: ['src/typeorm/migrations/*.ts'],
};

export default config;
