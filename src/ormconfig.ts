import { ConnectionOptions } from 'typeorm';
import 'dotenv/config';

const config: ConnectionOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/**/*.entity{.ts,.js}'],
  synchronize: true,
  migrations: [__dirname + 'src/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export default config;

// import { ConnectionOptions } from 'typeorm';
// import 'dotenv/config';

// const config: ConnectionOptions = {
//   type: 'mysql',
//   host: "dev-database-1.ctzrspkyflfz.us-west-2.rds.amazonaws.com",
//   port: 3306,
//   username: 'masterDevUser',
//   password: 'Dev_Passw0rd22',
//   database: 'skillZen',
//   entities: [__dirname + '/**/**/*.entity{.ts,.js}'],
//   synchronize: true,
//   migrations: [__dirname + 'src/migrations/*{.ts,.js}'],
//   cli: {
//     migrationsDir: 'src/migrations',
//   },
// };

// export default config;
