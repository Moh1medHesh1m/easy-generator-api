export const MockJwtService = jest.fn().mockReturnValue({
  sign: jest.fn().mockImplementation(() => 'token'),
  get: jest.fn(),
});
