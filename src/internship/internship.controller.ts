import {
  Get,
  Post,
  Body,
  Param,
  Query,
  Headers,
  UseGuards,
  Controller,
  HttpException,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { Internship } from './internship.entity';
import { RolesGuard, Roles } from '../utils';
import { InternshipService } from './internship.service';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedResultDto } from './dto/paginatedResult.dto';
import { CreateInternshipDto } from './dto/create-internship.dto';

/**
 * Internship Controller
 */
@Controller('internship')
export class InternshipController {
  constructor(private readonly service: InternshipService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getPanginatedInternship(
    @Query() data: PaginationDto,
  ): Promise<PaginatedResultDto> {
    data.page = Number(data.page);
    data.limit = Number(data.limit);

    return await this.service.getInternships({
      ...data,
      limit: data.limit > 18 ? 18 : data.limit,
    });
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('user', 'admin')
  @UseInterceptors(ClassSerializerInterceptor)
  async getOneInternship(@Param('id') id: string): Promise<Internship> {
    try {
      return await this.service.getInternshipById(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('admin', 'user')
  @UseInterceptors(ClassSerializerInterceptor)
  async createInternship(
    @Headers('authorization') token: string,
    @Body() data: CreateInternshipDto,
  ): Promise<Internship> {
    try {
      // if (user.userType === 'student') {
      //   throw new HttpException(
      //     'You are not authorized to create an internship',
      //     HttpStatus.UNAUTHORIZED,
      //   );
      // }

      return await this.service.createInternship(token, data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}