import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class AdminDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @IsOptional()
  readonly adminToken ?: string;
}

