import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthController, UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "../utils";
import "dotenv/config";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1h" },
    }),
  ],
  controllers: [UserController, AuthController],
  providers: [UserService, JwtStrategy],
})
export class UserModule {}
