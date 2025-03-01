import { Aggregate } from 'mongoose';

export abstract class MockEntityRepository<T> {
  protected abstract entityStub: T;

  constructor(createEntityData: T) {
    this.constructorSpy(createEntityData);
  }

  constructorSpy(_createEntityData: T): void {}

  async findOne(): Promise<T> {
    return this.entityStub;
  }

  async find(): Promise<T[]> {
    return [this.entityStub];
  }

  async create(): Promise<T> {
    return this.entityStub;
  }

  async findOneAndUpdate(): Promise<T> {
    return this.entityStub;
  }
  async updateMany() {
    return {
      n: 2,
      nModified: 1,
      ok: 1,
    };
  }
  async count() {
    return 1;
  }
  async deleteMany() {
    return true;
  }
  async aggregate<AggregatedData>(): Promise<Aggregate<AggregatedData[]>> {
    return [] as AggregatedData[];
  }
}
