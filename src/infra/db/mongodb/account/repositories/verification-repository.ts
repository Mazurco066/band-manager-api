// Dependencies
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { MongoError } from 'mongodb'

// Domain
import { VerificationCode, VerificationCodeDocument } from '@/domain/entities/account'
import { Filter, Paging, IBaseRepository } from '@/domain/shared'

// Interfaces
export type IVerificationRepository = IBaseRepository<VerificationCode>

export class VerificationRepository implements IVerificationRepository {
  constructor(
    @InjectModel(VerificationCode.name) private readonly connection: Model<VerificationCodeDocument>
  ) {}
  
  async find(params: Filter, pagingOptions?: Paging): Promise<VerificationCode[] | null> {
    const r = await this.connection
      .find({ ...params })
      .limit(pagingOptions.limit || 0)
      .skip(pagingOptions.offset || 0)
      .lean()
    return r
  }

  async findPopulated(params: Filter, pagingOptions?: Paging): Promise<VerificationCode[] | null> {
    const r = await this.connection
      .find({ ...params })
      .limit(pagingOptions.limit || 0)
      .skip(pagingOptions.offset || 0)
      .populate('account')
      .lean()
    return r
  }

  async findOne(params: Filter): Promise<VerificationCode | null> {
    const r = await this.connection.findOne({ ...params })
    return r.toObject()
  }

  async findOnePopulated(params: Filter): Promise<VerificationCode | null> {
    const r = await this.connection.findOne({ ...params }).populate('account')
    return r.toObject()
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

  async save(target: any): Promise<VerificationCode> {
    try {
      
      const r = await this.connection.create({ ...target })
      return r.toObject()
      
    } catch(ex) {
      console.error(ex)
      throw new MongoError({ ...ex })
    }
  }

  async update(target: any, params: Filter): Promise<VerificationCode> {
    try {

      const r = await this.connection.findOneAndUpdate(params, {
        $set: { ...target, updatedAt: new Date() }
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