import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { RedisService } from 'src/modules/utils/services/redis.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private redisService : RedisService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger

  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  async validate(payload) {
    const userId = payload.sub;
    this.logger.debug(`Validating JWT for user ID: ${userId}`);

    let user = await this.redisService.get(`user:${userId}`);
    if (!user) {
      this.logger.warn(`User ${userId} not found in cache, fetching from DB`);

      // If not found in cache, get from DB
      user = await this.authService.validateUser(userId);
      if (!user) {
        this.logger.error(`User ${userId} not found, throwing UnauthorizedException`);
        throw new UnauthorizedException();
      }

      await this.redisService.set(`user:${userId}`, user, 3600);
      this.logger.info(`User ${userId} cached in Redis`);

    }

    return user;
  }
}
