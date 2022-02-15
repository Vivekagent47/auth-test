import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TokenDto } from './dto/token.dto';
import { User, CreateUserDto, UserService } from '../user';
import { LoginCredential } from './dto/login-credential.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AdminDto } from './dto/create-admin.dto';

/**
 * Auth service
 */
@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    private readonly jwtService: JwtService,
  ) {}

  /**
   * register user
   */
  async registerUser(userData: CreateUserDto): Promise<User> {
    return this.userService.createUser(userData);
  }

  async registerAdmin(userData: AdminDto): Promise<User> {
    return this.userService.createAdmin(userData);
  }

  async registerProfile(user: User) {
    if (user.userType === 'student') {
      await this.userService.initialStudentProfile(user.id);
    }
    if (user.userType === 'recruiter') {
      await this.userService.initialRecruiterProfile(user.id);
    }
  }

  /**
   * login user
   */
  async login(credential: LoginCredential): Promise<any> {
    const user = await this.userService.getUserByEmail(credential.email);

    // console.log(process.env.JWT_SECRET);
    // console.log(user);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatched = await this.userService.checkPassword(
      user,
      credential.password,
    );

    if (!isMatched) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('Inactive user');
    }
    delete user.password;

    const authToken: TokenDto = this.generateAuthToken(user);
    // console.log(authToken);
    return Promise.resolve({ authToken, user });
  }

  /**
   * admin login
   */ 
  async loginAdmin(data : AdminDto): Promise<any> {
    const user = await this.userService.getUserByEmail(data.email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatched = await this.userService.checkPassword(
      user,
      data.password,
    );

    if (!isMatched) {
      throw new Error('Invalid Admin credentials');
    }

    delete user.password;

    const authToken: TokenDto = this.generateAuthToken(user);

    return Promise.resolve({ authToken, user });
  }

  /**
   * refresh token
   */
  async refreshToken(token: RefreshTokenDto): Promise<TokenDto> {
    let payload: any;

    try {
      payload = this.jwtService.verify(token.refreshToken);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }

    const { userId, type } = payload;

    if (type !== 'refresh') {
      throw new Error('Wrong token type');
    }

    const user = await this.userService.getUserById(userId);

    if (!user) {
      throw new Error('Invalid user');
    }

    if (!user.isActive) {
      throw new Error('Inactive user');
    }

    const authToken = this.generateAuthToken(user);
    return Promise.resolve(authToken);
  }

  /**
   * Generate Auth Token
   * @param user
   */
  private generateAuthToken(user: User): TokenDto {
    const accessToken = this.jwtService.sign({
      sub: () => user.email,
      type: 'access',
      email: user.email,
      roles: user.roles,
      userId: user.id,
    });

    const refreshToken = this.jwtService.sign({
      sub: () => user.email,
      type: 'refresh',
      userId: user.id,
    });

    return { accessToken, refreshToken };
  }
}
