import {
  Get,
  Put,
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
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { Internship } from './internship.entity';
import { RolesGuard, Roles, AuthUser } from '../utils';
import { InternshipService } from './internship.service';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedResultDto } from './dto/paginatedResult.dto';
import { CreateInternshipDto } from './dto/create-internship.dto';
import { ApplyInternshipDto } from './dto/apply-internship.dto';
import { User } from '../user/user.entity';

/**
 * Internship Controller
 */
@Controller('internship')
export class InternshipController {
  constructor(private readonly internshipService: InternshipService) {}

  @Get()
  @Roles('admin', 'user')
  @UseInterceptors(ClassSerializerInterceptor)
  async getPanginatedInternship(
    @Headers('authorization') token: string,
    @Query() data: PaginationDto,
  ): Promise<PaginatedResultDto> {
    data.page = Number(data.page);
    data.limit = Number(data.limit ? data.limit : 18);

    return await this.internshipService.getInternships(
      {
        ...data,
        limit: data.limit > 18 ? 18 : data.limit,
      },
      token,
    );
  }

  @Get('/all')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('admin', 'user')
  @UseInterceptors(ClassSerializerInterceptor)
  async getAllInternships(
    @Headers('authorization') token: string,
    @Query() data: PaginationDto,
  ): Promise<PaginatedResultDto> {
    try {
      return await this.internshipService.getAllInternships(token, {
        ...data,
        limit: data.limit > 18 ? 18 : data.limit,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/bystatus')
  @UseGuards(RolesGuard)
  @Roles('admin', 'user')
  @UseInterceptors(ClassSerializerInterceptor)
  async getInternshipByStatus (
    @Headers('authorization') token: string,
    @Param('status') status: string,
  ): Promise<Internship[]> {
    try {
      return await this.internshipService.getInternshipByStatus(token, status);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async getOneInternship(
    // @Headers('authorization') token: string,
    @AuthUser() user: User,
    @Param('id') id: string,
  ): Promise<Internship> {
    try {
      return await this.internshipService.getInternshipById(user, id);
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
      return await this.internshipService.createInternship(token, data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('/update/:id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('admin', 'user')
  @UseInterceptors(ClassSerializerInterceptor)
  async updateInternship(
    @Headers('authorization') token: string,
    @Param('id') id: string,
    @Body() data: CreateInternshipDto,
  ): Promise<{ success: boolean; message: string }> {
    try {
      return await this.internshipService.updateInternship(token, id, data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch('/activate/:id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @UseInterceptors(ClassSerializerInterceptor)
  async activateInternship(
    @Param('id') id: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      return await this.internshipService.activateInternship(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch('/deactivate/:id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('admin', 'user')
  @UseInterceptors(ClassSerializerInterceptor)
  async deactivateInternship(
    @Headers('authorization') token: string,
    @Param('id') id: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      return await this.internshipService.deactivateInternship(id, token);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/apply/:id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('user')
  @UseInterceptors(ClassSerializerInterceptor)
  async applyInternship(
    @Headers('authorization') token: string,
    @Param('id') id: string,
    @Body() data: ApplyInternshipDto,
  ): Promise<{ success: boolean; message: string }> {
    try {
      console.log(data);
      return await this.internshipService.applyInternship(token, id, data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/click/:id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('user')
  @UseInterceptors(ClassSerializerInterceptor)
  async clickInternship(
    @Headers('authorization') token: string,
    @Param('id') id: string,
  ): Promise<{ success: boolean; message: string }>{
    try{
      return this.internshipService.addInternshipClick(token,id)
    }catch(error){
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}



