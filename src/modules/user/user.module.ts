import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UtilsModule } from '../utils/utils.module';
import { ConfigService } from '@nestjs/config';
import { UserController } from './user.controller';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
    UtilsModule,
  ],
  controllers: [UserController],
  providers: [
    UserRepository,
    UserService,
    ConfigService,
    JwtService,
  ],
  exports: [UserService, UserRepository],
})
export class UserModule {}
