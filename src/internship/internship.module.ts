import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InternshipController } from './internship.controller';
import { Internship } from './internship.entity';
import { InternshipRepository } from './internship.repository';
import { InternshipService } from './internship.service';

@Module({
  imports: [TypeOrmModule.forFeature([Internship, InternshipRepository])],
  exports: [InternshipService],
  providers: [InternshipService],
  controllers: [InternshipController],
})
export class InternshipModule {}
