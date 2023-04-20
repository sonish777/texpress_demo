import { DataSourceOptions } from 'typeorm';

export const OrmConfig: DataSourceOptions = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [
        __dirname + '/../entities/*.entity{.ts,.js}',
        __dirname + '/../../../../apps/texpress-api/dist/entities/*.entity.js',
        __dirname + '/../../../../apps/texpress-cms/dist/entities/*.entity.js',
    ],
    synchronize: false,
};
