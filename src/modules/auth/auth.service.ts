import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { HashService } from '../utils/services/hash.service';
import { User, UserDocument } from '../user/schemas/user.schema';
import { RegisterDto } from './dtos/register.dto';
import { Logger } from 'winston';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly hashService : HashService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  async login(user: UserDocument) {
    this.logger.info(`Generating JWT token for user: ${user.email}`);

    const payload = { username: user.email, sub: user._id };
    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async validateUserCredentials(email: string, password: string) {
    this.logger.info(`Validating user credentials for email: ${email}`);
    const user = await this.userService.findOneByEmail(email);

    if (!user) { 
      this.logger.warn(`Login failed: User with email ${email} not found`);

      return null; }
    const isMatch = await this.hashService.isDataMatch(password, user.password);
    if (isMatch) {

      const {
        email,
        _id,
        name,
        createdAt,
        updatedAt,
      } = user;
      this.logger.info(`User ${email} authenticated successfully`);

      return {
        email,
        _id,
        name,
        createdAt,
        updatedAt,
      } as UserDocument;
    }
    return null;
  }

  async registerUser(userData: RegisterDto) {
    const user = await this.userService.registerUserDto({
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });

    const payload = { email: user.email, sub: user._id };
    return {
      user: user,
      accessToken: this.jwtService.sign(payload),
    };
  }


  async validateUser(id: string): Promise<User> {
    const user = await this.userService.findOneById(id);
    if (!user) return null;


    const {
      name,
      email,
      _id,
      createdAt,
      updatedAt,
    } = user;
    return {
      email,
      name,
      _id,
      createdAt,
      updatedAt,
    } as UserDocument;
  }
}
