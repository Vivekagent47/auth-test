import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Recruiter } from './recruiter.entity';
import { Student } from './student.entity';
import { UserRepository } from './user.repository';
import { StudentRepository } from './user.repository';
import { RecruiterRepository } from './user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRepository]),
    TypeOrmModule.forFeature([Student, StudentRepository]),
    TypeOrmModule.forFeature([Recruiter, RecruiterRepository]),
  ],
  exports: [UserService],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
