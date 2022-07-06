import { DataSource } from 'typeorm';
import { Complain } from './entities/Complain';
import { User } from './entities/User';
import path from 'path';
import { __prod__ } from './constants';

export const dataSource = new DataSource({
  url: process.env.DATABASE_URL,
  type: 'postgres',
  logging: false,
  synchronize: true,
  entities: [Complain, User],
  migrations: [path.join(__dirname, './migrations/*')],
  ssl: {
    rejectUnauthorized: false,
  },
});
