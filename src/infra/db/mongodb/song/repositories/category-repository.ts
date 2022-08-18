// Dependencies
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { MongoError } from 'mongodb'

// Domain
import { Category, CategoryDocument } from '@/domain/entities/song'
import { Filter, Paging, IBaseRepository } from '@/domain/shared'

// Interfaces
export type ICategoryRepository = IBaseRepository<Category>

export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectModel(Category.name) private readonly connection: Model<CategoryDocument>
  ) {}
  
  async find(params: Filter, pagingOptions?: Paging): Promise<Category[] | null> {
    const r = await this.connection
      .find({ ...params })
      .limit(pagingOptions?.limit || 0)
      .skip(pagingOptions?.offset || 0)
      .lean()
    return r
  }

  async findPopulated(params: Filter, pagingOptions?: Paging): Promise<Category[] | null> {
    const r = await this.connection
      .find({ ...params })
      .limit(pagingOptions?.limit || 0)
      .skip(pagingOptions?.offset || 0)
      .populate('band')
      .lean()
    return r
  }

  async findOne(params: Filter): Promise<Category | null> {
    const r = await this.connection.findOne({ ...params })
    return r ? r.toObject() : r
  }

  async findOnePopulated(params: Filter): Promise<Category | null> {
    const r = await this.connection
      .findOne({ ...params })
      .populate('band')
    return r ? r.toObject() : r
  }

  async delete(params: Filter): Promise<boolean> {
    try {

      const r = await this.connection.deleteOne({ ...params })
      return r.deletedCount > 0

    } catch(ex) {
      console.error(ex)
      throw new MongoError({ ...ex })
    }
  }

  async exists(params: Filter): Promise<boolean> {
    return await this.connection.exists(params)
  }

  async save(target: any): Promise<Category> {
    const r = await this.connection.create({ ...target })
    return r.toObject()
  }

  async update(target: any, id: string): Promise<Category> {
    try {
      const r = await this.connection.findOneAndUpdate({ id }, {
        ...target
      }, {
        new: true,
        useFindAndModify: false
      })
      return r.toObject()

    } catch(ex) {
      console.error(ex)
      throw new MongoError({ ...ex })
    }
  }
}
