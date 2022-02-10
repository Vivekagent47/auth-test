import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
// import { JWT_SECRET } from 'src/config';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  exports: [JwtModule],
})
export class SharedModule {}
