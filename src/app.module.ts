import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WinstonModule } from 'nest-winston';
import { loggerConf } from './logger';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { SharedModule } from './shared/shared.module';
import { UtilsModule } from './utils/utils.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { InternshipModule } from './internship/internship.module';

import { JwtTokenMiddleware, LoggerInterceptor } from './utils';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from './ormconfig';
// import { JWT_SECRET } from './config';
import { ConfigModule } from '@nestjs/config';

console.log(config);
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(config),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    WinstonModule.forRoot(loggerConf),
    AuthModule,
    UserModule,
    SharedModule,
    UtilsModule,
    InternshipModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtTokenMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
