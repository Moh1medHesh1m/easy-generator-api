import { Prop } from '@nestjs/mongoose';

export class CommonSchema {
  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}
