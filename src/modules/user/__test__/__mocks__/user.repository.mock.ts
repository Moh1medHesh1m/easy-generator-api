import { MockEntityRepository } from '../../../../modules/database/__test__/__mocks__/entity.repository.mock';
import { User } from '../../schemas/user.schema';
import { userStub } from '../stubs/user.stub';

export class MockUserRepository extends MockEntityRepository<User> {
  protected entityStub: User = userStub();
}
