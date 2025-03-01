export const MockHashService = jest.fn().mockReturnValue({
  isDataMatch: jest.fn(),
  hash: jest.fn(),
  generateToken: jest.fn(),
});
