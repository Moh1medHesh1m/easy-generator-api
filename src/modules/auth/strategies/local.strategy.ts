import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from '../../../modules/user/schemas/user.schema';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    super({ usernameField: 'email' });
  }
  async validate(email: string, password: string): Promise<User> {
    this.logger.debug(`Validating credentials for email: ${email}`);

    const user = await this.authService.validateUserCredentials(
      email,
      password,
    );
    if (!user) {
      this.logger.warn(`Invalid credentials for email: ${email}`);

      throw new UnauthorizedException();
    }
    return user;
  }
}
