import { Types } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';

export const userStub = (): UserDocument => {
  return {
    _id: new Types.ObjectId('63cfe3c2f229fcac8c6c7571'),
    email: 'fake@email.com',
    name: 'fake full name',
    password: 'A$Very%Strong&Password$$Hash',
  } as UserDocument;
};
