import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from './../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SharedModule } from './../shared/shared.module';

@Module({
  imports: [forwardRef(() => SharedModule), UserModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
