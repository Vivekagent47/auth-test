import {
  Injectable,
  Inject,
  forwardRef,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import { CreateInternshipDto } from './dto/create-internship.dto';
import { PaginatedResultDto } from './dto/paginatedResult.dto';
import { PaginationDto } from './dto/pagination.dto';
import { Internship } from './internship.entity';
import { UserService } from '../user';

/**
 * Internship Service
 */
@Injectable()
export class InternshipService {
  constructor(
    @InjectRepository(Internship)
    private readonly internshipRepo: Repository<Internship>,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    private readonly jwtService: JwtService,
  ) {}

  /**
   * Create Internship
   */
  async createInternship(
    token: string,
    data: CreateInternshipDto,
  ): Promise<Internship> {
    const internship = new Internship();
    internship.isActive = false;
    internship.jobName = data.jobName;
    internship.companyName = data.companyName;
    internship.companyUrl = data.companyUrl;
    internship.aboutCompany = data.aboutCompany;
    internship.jobDescription = data.jobDescription ? data.jobDescription : '';
    internship.skills = data.skills;
    internship.noOfOpening = data.noOfOpening;
    internship.minStipen = data.minStipen ? data.minStipen : 0;
    internship.maxStipen = data.maxStipen ? data.maxStipen : 0;
    internship.currencyType = data.currencyType ? data.currencyType : '';
    internship.internshipType = data.internshipType;
    internship.internshipPeriod = data.internshipPeriod;
    internship.applyBy = data.applyBy;
    internship.startDate = data.startDate;
    internship.responsibilities = data.responsibilities
      ? data.responsibilities
      : [];
    internship.whoCanApply = data.whoCanApply ? data.whoCanApply : [];

    let payload: any;

    try {
      payload = this.jwtService.verify(token.split(' ')[1]);
    } catch (err) {
      throw new Error('Invalid token');
    }

    const user = await this.userService.getUserById(payload.userId);

    try {
      if (!user.isActive) {
        throw new Error('Inactive user');
      }

      if (user.userType === 'student') {
        throw new HttpException(
          'You are not authorized to create an internship',
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (user.userType === 'recruiter') {
        return await this.internshipRepo.save(internship);
      }

      throw new HttpException(
        'You are not authorized to create an internship',
        HttpStatus.UNAUTHORIZED,
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * gel paginated internship list
   */
  async getInternships(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResultDto> {
    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;

    const totalCount = await this.internshipRepo.count();
    const products = await this.internshipRepo
      .createQueryBuilder()
      .orderBy('createdAt', 'DESC')
      .offset(skippedItems)
      .limit(paginationDto.limit)
      .getMany();

    return {
      totalCount,
      page: paginationDto.page,
      limit: paginationDto.limit,
      data: products,
    };
  }

  /**
   * gel internship by ID
   */
  getInternshipById(id: string): Promise<Internship> {
    return this.internshipRepo.findOne(id);
  }
}
