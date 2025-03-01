import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { UserService } from '../src/modules/user/user.service';
import { userStub } from '../src/modules/user/__test__/stubs/user.stub';

export default async (): Promise<void> => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();
  await app.init();


  await app.close();
};
