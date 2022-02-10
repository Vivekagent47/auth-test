import { ConnectionOptions } from 'typeorm';
import 'dotenv/config';

const config: ConnectionOptions = {
  type: 'mysql',
  host: 'db',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'skillzen',
  entities: [__dirname + 'dist/src/**/*.entity{.ts,.js}'],
  synchronize: true,
  migrations: [__dirname + 'dist/src/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: 'dist/src/migrations',
  },
};

export default config;
