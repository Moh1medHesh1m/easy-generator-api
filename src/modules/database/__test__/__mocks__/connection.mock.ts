export const mockConnection = {
  readyState: 1,
  close: jest.fn(),
  on: jest.fn(),
  db: { databaseName: 'test' },
  collection: jest.fn().mockReturnValue({
    insertOne: jest.fn(),
    findOne: jest.fn(),
  }),
};