import { userStub } from '../stubs/user.stub';

export const MockUsersService = jest.fn().mockReturnValue({
  createUser: jest.fn().mockResolvedValue(userStub()),
});
