import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User, UserDocument } from './schemas/user.schema';
import { HashService } from '../utils/services/hash.service';
import { RegisterDto } from '../auth/dtos/register.dto';
import { Types } from 'mongoose';
import { Logger } from 'winston';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
    @Inject('winston') private readonly logger: Logger, 
  ) {}

  async registerUserDto(user: RegisterDto) {
    this.logger.info(`Registering user with email: ${user.email}`);
    const createdUser = await this.userRepository.findOne({
      email: user.email,
    });
    if (createdUser) {
      this.logger.warn(`Registration failed: Email ${user.email} is already taken`);

        throw new HttpException(
          {
            message: 'email is already taken',
          },
          HttpStatus.BAD_REQUEST,
        );
    }
    const hashedPassword = await this.hashService.hash(user.password);
    const userData = await this.userRepository.create<User>({
      ...user,
      password: hashedPassword,
    });
    this.logger.info(`User registered successfully: ${user.email}`);

    const {
      name,
      email,
      createdAt,
      updatedAt,
      _id,
    } = userData;
    return {
      name,
      email,
      createdAt,
      updatedAt,
      _id,
    } as UserDocument;
  }

  async findOneById(id: string) : Promise<User> {
    this.logger.info(`Fetching user by ID: ${id}`);

    const user = await this.userRepository.findOne(
      {
        _id: new Types.ObjectId(id),
      },
      { password: 0 },
    );
    if (!user) {
      this.logger.warn(`User not found by ID: ${id}`);
    }

    return user;
  }

  async findOneByEmail(email: string) : Promise<User> {
    this.logger.info(`Fetching user by email: ${email}`);

    const user = await this.userRepository.findOne(
      { email },
    );
    if (!user) {
      this.logger.warn(`User not found by email: ${email}`);
    }
    return user;
  }
}
