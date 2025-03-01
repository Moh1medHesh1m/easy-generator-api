import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { MockUsersService } from '../../../modules/user/__test__/__mocks__/user.service.mock';
import { UserService } from '../../../modules/user/user.service';
import { HashService } from '../../../modules/utils/services/hash.service';
import { AuthService } from '../auth.service';
import { MockJwtService } from './__mocks__/jwt.service.mock';
import { MockHashService } from '../../../modules/utils/services/__test__/__mocks__/hash.service.mock';
import { MockConfigService } from '../../../modules/utils/services/__test__/__mocks__/config.service.mock';
import { userStub } from '../../../modules/user/__test__/stubs/user.stub';
import { UserDocument } from '../../../modules/user/schemas/user.schema';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

describe('auth service', () => {
  let usersService: UserService;
  let jwtService: JwtService;
  let hashService: HashService;
  let configService: ConfigService;
  let authService: AuthService;
  let winstonService: Logger;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useClass: MockUsersService,
        },
        {
          provide: JwtService,
          useClass: MockJwtService,
        },
        {
          provide: HashService,
          useClass: MockHashService,
        },
        {
          provide: ConfigService,
          useClass: MockConfigService,
        },
        {
          provide: ConfigService,
          useClass: MockConfigService,
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: {
            info: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
          },
        }
      ],
    }).compile();

    hashService = moduleRef.get<HashService>(HashService);
    usersService = moduleRef.get<UserService>(UserService);
    jwtService = moduleRef.get<JwtService>(JwtService);
    configService = moduleRef.get<ConfigService>(ConfigService);
    authService = moduleRef.get<AuthService>(AuthService);
    winstonService = moduleRef.get<Logger>(WINSTON_MODULE_PROVIDER);

  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('auth service should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should return user with accessToken', async () => {
      const signSpy = jest
        .spyOn(jwtService, 'sign')
        .mockImplementation(() => 'token');

      const expected = await authService.login(userStub() as UserDocument);
      expect(signSpy).toBeCalled();
      expect(expected).toEqual({
        user: userStub() as UserDocument,
        accessToken: 'token',
      });
    });
  });
});
