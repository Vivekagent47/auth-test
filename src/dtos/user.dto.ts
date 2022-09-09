import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  Matches,
  MaxLength,
} from "class-validator";

enum userType {
  customer = "customer",
  consumer = "consumer",
}

export class CreateUserDto {
  @IsEmail()
  @MaxLength(320)
  email: string;

  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  )
  password: string;

  @IsEnum(userType)
  readonly userType: userType;
}

export class LoginDto {
  @IsEmail()
  @MaxLength(320)
  email: string;

  @IsNotEmpty()
  password: string;
}
