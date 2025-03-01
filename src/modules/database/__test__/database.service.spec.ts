import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../database.service';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { mockConnection } from './__mocks__/connection.mock';

describe('DatabaseService', () => {
  let databaseService: DatabaseService;
  let mockDbConnection: Connection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseService,
        {
          provide: getConnectionToken(), 
          useValue: mockConnection,
        },
      ],
    }).compile();

    databaseService = module.get<DatabaseService>(DatabaseService);
    mockDbConnection = module.get<Connection>(getConnectionToken()); 
  });

  describe('getDbHandle', () => {
    it('should return the mock connection', () => {
      const result = databaseService.getDbHandle();
      expect(result).toBeDefined();
      expect(result).toBe(mockDbConnection);
    });
  });
});
