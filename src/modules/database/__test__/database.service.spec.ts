import { Test, TestingModule } from '@nestjs/testing';
import { Connection } from 'mongoose';
import { DatabaseService } from '../database.service';
import { MockConnection } from './__mocks__/connection.mock';

describe('DatabaseService', () => {
  let databaseService: DatabaseService;
  let mockConnection: Connection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseService,
        {
          provide: Connection,
          useClass: MockConnection,
        },
      ],
    }).compile();

    databaseService = module.get<DatabaseService>(DatabaseService);
    mockConnection = module.get<Connection>(Connection);
  });

  describe('getDbHandle', () => {
    it('should return the mock connection', () => {
      const result = databaseService.getDbHandle();
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Connection);
      expect(result).toEqual(mockConnection);
    });
  });
});
