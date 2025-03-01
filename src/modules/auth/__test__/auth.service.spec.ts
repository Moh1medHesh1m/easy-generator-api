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

describe('auth service', () => {
  let usersService: UserService;
  let jwtService: JwtService;
  let hashService: HashService;
  let configService: ConfigService;
  let authService: AuthService;
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
      ],
    }).compile();

    hashService = moduleRef.get<HashService>(HashService);
    usersService = moduleRef.get<UserService>(UserService);
    jwtService = moduleRef.get<JwtService>(JwtService);
    configService = moduleRef.get<ConfigService>(ConfigService);
    authService = moduleRef.get<AuthService>(AuthService);
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
