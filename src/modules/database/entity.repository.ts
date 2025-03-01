import {
  Aggregate,
  Document,
  FilterQuery,
  Model,
  PopulateOption,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

export abstract class EntityRepository<T extends Document> {
  constructor(protected readonly entityModel: Model<T>) {}

  async findOne(
    entityFilterQuery: FilterQuery<T>,
    projection?: Record<string, unknown>,
    queryOptions?: QueryOptions<unknown>,
  ): Promise<T | null> {
    return this.entityModel
      .findOne(
        entityFilterQuery,
        {
          __v: 0,
          ...projection,
        },
        queryOptions,
      )
      .exec();
  }

  async find(
    entityFilterQuery: FilterQuery<T>,
    projection?: Record<string, unknown>,
    queryOptions?: QueryOptions<unknown>,
  ): Promise<T[] | null> {
    return this.entityModel.find(entityFilterQuery, projection, queryOptions);
  }
  async findWithSelection(
    entityFilterQuery: FilterQuery<T>,
    projection?: Record<string, unknown>,
    queryOptions?: QueryOptions<unknown>,
    selectionQuery?: string,
  ): Promise<T[] | null> {
    return this.entityModel
      .find(entityFilterQuery, projection, queryOptions)
      .select(selectionQuery);
  }

  async count(entityFilterQuery: FilterQuery<T>): Promise<number> {
    return this.entityModel.count(entityFilterQuery);
  }
  async create<ModelData>(createEntityData: ModelData): Promise<T> {
    const entity = new this.entityModel(createEntityData);
    entity.save();
    return entity;
  }

  async findOneAndUpdate(
    entityFilterQuery: FilterQuery<T>,
    updateEntityData: UpdateQuery<T>,
    queryOptions?: QueryOptions,
  ): Promise<T | null> {
    return this.entityModel
      .findOneAndUpdate(entityFilterQuery, updateEntityData, {
        ...queryOptions,
        new: true,
      })
      .lean();
  }

  async updateMany(
    entityFilterQuery: FilterQuery<T>,
    updateEntityData: UpdateQuery<T>,
  ) {
    return await this.entityModel
      .updateMany(entityFilterQuery, updateEntityData, {
        new: true,
      })
      .exec();
  }

  async deleteMany(entityFilterQuery: FilterQuery<T>): Promise<boolean> {
    const deleteResult = await this.entityModel.deleteMany(entityFilterQuery);
    return deleteResult.deletedCount >= 1;
  }

  async deleteOne(entityFilterQuery: FilterQuery<T>) {
    const deleteResult = await this.entityModel.deleteOne(entityFilterQuery);
    return deleteResult.deletedCount >= 1;
  }

  async aggregate<AggregatedData>(
    pipeline: any[],
  ): Promise<Aggregate<AggregatedData[]>> {
    return await this.entityModel.aggregate(pipeline).exec();
  }

  async updateOne(
    entityFilterQuery: FilterQuery<T>,
    updateEntityData: UpdateQuery<T>,
  ) {
    return this.entityModel
      .updateOne(entityFilterQuery, updateEntityData)
      .exec();
  }

  async findAndPopulateWithDateSortedPagination(
    entityFilterQuery: FilterQuery<T>,
    populateField?: PopulateOption,
    skip?: number,
    limit?: number,
  ): Promise<T[] | null> {
    let queryPromise: any = this.entityModel
      .find(entityFilterQuery)
      .sort({ createdAt: -1 });
    if (populateField) {
      queryPromise = queryPromise
        .populate(populateField.populate)
        .skip(skip)
        .limit(limit);
    }
    return queryPromise.exec();
  }
}
