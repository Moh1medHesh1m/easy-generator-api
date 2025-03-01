import { HttpException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { HashService } from '../../../modules/utils/services/hash.service';
import { MockConfigService } from '../../../modules/utils/services/__test__/__mocks__/config.service.mock';
import { MockHashService } from '../../../modules/utils/services/__test__/__mocks__/hash.service.mock';
import { UserDocument } from '../schemas/user.schema';
import { UserRepository } from '../user.repository';
import { UserService } from '../user.service';
import { userStub } from './stubs/user.stub';
import { MockUserRepository } from './__mocks__/user.repository.mock';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

describe('auth service', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let hashService: HashService;
  let configService: ConfigService;
  let winstonService: Logger;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useClass: MockUserRepository,
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
          provide: WINSTON_MODULE_PROVIDER, 
          useValue: {
            info: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
          },
        },
      ],
    }).compile();
    userRepository = moduleRef.get<UserRepository>(UserRepository);
    hashService = moduleRef.get<HashService>(HashService);
    userService = moduleRef.get<UserService>(UserService);
    configService = moduleRef.get<ConfigService>(ConfigService);
    winstonService = moduleRef.get<Logger>(WINSTON_MODULE_PROVIDER);

  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('User Service should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    it('should create user and return user ', async () => {
      const findOneSpy = jest
        .spyOn(userRepository, 'findOne')
        .mockImplementation(() => null);
      const hashSpy = jest.spyOn(hashService, 'hash');
      const createSpy = jest
        .spyOn(userRepository, 'create')
        .mockImplementation(async () => userStub() as UserDocument);
      const { name, email, _id } = await userService.registerUserDto(
        userStub(),
      );
      const expected = { _id, name, email };
      const { password, ...restObject } = userStub();
      expect(expected).toEqual({ ...restObject });
      expect(findOneSpy).toBeCalled();
      expect(hashSpy).toBeCalled();

      expect(createSpy).toBeCalled();
    });
    it('should throw bad request ', async () => {
      const findOneSpy = jest
        .spyOn(userRepository, 'findOne')
        .mockImplementation(async () => userStub() as UserDocument);
      await expect(userService.registerUserDto(userStub())).rejects.toThrow(
        'email is already taken',
      );
      expect(findOneSpy).toBeCalled();
    });
  });
});
