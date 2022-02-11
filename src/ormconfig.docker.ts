import { ConnectionOptions } from 'typeorm';
import 'dotenv/config';

const config: ConnectionOptions = {
  type: 'mysql',
  host: 'db',
  port: 3306,
  username: 'dbuser',
  password: 'dbuser',
  database: 'skillzen',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
  // migrations: [__dirname + '/migrations/*{.ts,.js}'],
  // cli: {
  //   migrationsDir: '/migrations',
  // },
};

export default config;
