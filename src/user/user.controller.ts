import {
  Get,
  Body,
  Put,
  Post,
  Delete,
  Param,
  Headers,
  UseGuards,
  Controller,
  HttpStatus,
  HttpException,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { User } from './user.entity';
import { UserService } from './user.service';
import { RolesGuard, Roles, AuthUser } from '../utils';
// import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserRole } from '.';
import { KycDto } from './dto/kyc.dto';
import { AdminDto } from '../auth/dto/create-admin.dto';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedResultDto } from './dto/pagination-result.dto';

/**
 * User controller
 */
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // trial current user
  // getting the current user from the request
  @Get('current')
  async currentUser(@AuthUser() user: User): Promise<User> {
    // console.log(user);
    return user;
  }

  /**
   * logged in user's profile
   */
  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('user', 'admin')
  @UseInterceptors(ClassSerializerInterceptor)
  async getMe(@Param('id') id: string): Promise<any> {
    try {
      return await this.userService.getUserById(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Get all user list
   */
  @Get()
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @UseInterceptors(ClassSerializerInterceptor)
  async getAllUser(): Promise<User[]> {
    try {
      return await this.userService.getAllUsers();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // @Put('/update/:id')
  // @ApiBearerAuth()
  // @UseGuards(RolesGuard)
  // @Roles('admin', 'user')
  // @UseInterceptors(ClassSerializerInterceptor)
  // async updateUser(
  //   @Param('id') id: string,
  //   @Body() data: Partial<User>,
  // ): Promise<User> {
  //   try {
  //     return await this.userService.updateUser(id, data);
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  // @Put('/passwordUpdate/:id')
  // @ApiBearerAuth()
  // @UseGuards(RolesGuard)
  // @Roles('user')
  // @UseInterceptors(ClassSerializerInterceptor)
  // async updatePassword(
  //   @Param('id') id: string,
  //   @Body() data: UpdatePasswordDto,
  // ): Promise<any> {
  //   try {
  //     return await this.userService.updatePassword(id, data);
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  @Put('/roleUpdate/:id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @UseInterceptors(ClassSerializerInterceptor)
  async updateRole(
    @Param('id') id: string,
    @Body() data: { roles: UserRole[] },
  ) {
    try {
      return await this.userService.updateRole(id, data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('/delete/:id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteUser(@Param('id') id: string): Promise<any> {
    try {
      return await this.userService.deleteUser(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

@Controller('recruiter')
export class RecruiterController {
  constructor(private readonly recruiterService: UserService) {}

  @Get('/kyc/:id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('admin', 'user')
  @UseInterceptors(ClassSerializerInterceptor)
  async getKycDeatils(@Param('id') id: string) {
    try {
      return await this.recruiterService.getKycDeatils(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/applykyc')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('user')
  @UseInterceptors(ClassSerializerInterceptor)
  async applyKyc(
    @Headers('authorization') token: string,
    @Body() data: KycDto,
  ): Promise<{ success: boolean; message: string }> {
    try {
      return await this.recruiterService.applyKyc(token, data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/dashboard')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('user')
  @UseInterceptors(ClassSerializerInterceptor)
  async getRecruiterDashboard(@AuthUser() user: User) {
    try {
      return await this.recruiterService.getRecruiterDashboard(user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/applicants')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('user')
  @UseInterceptors(ClassSerializerInterceptor)
  async getAllApplicants(
    @AuthUser() user: User,
    // @Query() data: PaginationDto,
  ): Promise<any> {
    try {
      return await this.recruiterService.getAllApplicants(user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: UserService) {}

  @Get('/profile/:id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('user', 'admin')
  @UseInterceptors(ClassSerializerInterceptor)
  async getStudentProfile(@Param('id') id: string) {
    try {
      return await this.studentService.getStudentProfile(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

@Controller('admin')
@Roles('admin')
@UseInterceptors(ClassSerializerInterceptor)
export class AdminController {
  constructor(private readonly adminService: UserService) {}

  /**
   * Dashboard will have
   * - total number of companies
   * - total number of students
   * - total number of internships
   * - Views
   * - application rate
   */
  @Get('/dashboard')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  async getDashboardDetails() {
    try {
      const { countCompanies, countInternships, countStudents } =
        await this.adminService.getDashboardDetails();

      return {
        companies: countCompanies,
        internships: countInternships,
        students: countStudents,
        //! views: views,
        //! applicationRate: applicationRate,
        //! Hired: Hired,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/companies')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  async getCompanies(@AuthUser() user: User) {
    if (user.roles[0] === 'admin') {
      return await this.adminService.getAllCompanies();
    }
    throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }

  @Put('/verifykyc/:id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async verifyKyc(@Param('id') id: string) {
    try {
      return await this.adminService.verifyKyc(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
