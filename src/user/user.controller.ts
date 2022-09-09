import {
  Body,
  Post,
  Controller,
  HttpStatus,
  HttpException,
  Delete,
  Param,
  ValidationPipe,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard, Roles, RolesGuard } from "../utils";
import { CreateUserDto, LoginDto } from "../dtos/user.dto";
import { User } from "../entities/user.entity";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Delete("/:id")
  async deleteUser(@Param("id") id: string) {
    try {
      await this.userService.deleteUser(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

@Controller()
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post("/login")
  async login(@Body(ValidationPipe) data: LoginDto) {
    try {
      return await this.userService.login(data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post("/signup")
  async createUser(@Body(ValidationPipe) data: CreateUserDto): Promise<User> {
    try {
      return this.userService.createUser(data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
