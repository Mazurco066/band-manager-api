// Dependencies
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { MongoError } from 'mongodb'

// Domain
import { Invite, InviteDocument } from '@/domain/entities/band'
import { Filter, IBaseRepository, Paging } from '@/domain/shared'

// Interfaces
export type IInviteRepository = IBaseRepository<Invite>

export class InviteRepository implements IInviteRepository {
  constructor(
    @InjectModel(Invite.name) private readonly connection: Model<InviteDocument>
  ) {}
  
  async find(params: Filter, pagingOptions?: Paging): Promise<Invite[] | null> {
    const options = pagingOptions ? pagingOptions : { limit: 0, offset: 0 }
    const r = await this.connection
      .find({ ...params })
      .limit(options.limit || 0)
      .skip(options.offset || 0)
      .lean()
    return r
  }

  async findPopulated(params: Filter, pagingOptions?: Paging): Promise<Invite[] | null> {
    const options = pagingOptions ? pagingOptions : { limit: 0, offset: 0 }
    const r = await this.connection
      .find({ ...params })
      .limit(options.limit || 0)
      .skip(options.offset || 0)
      .populate('account')
      .populate('band')
      .lean()
    return r
  }

  async findOne(params: Filter): Promise<Invite | null> {
    const r = await this.connection.findOne({ ...params })
    return r.toObject()
  }

  async findOnePopulated(params: Filter): Promise<Invite | null> {
    const r = await this.connection
      .findOne({ ...params })
      .populate('account')
      .populate('band')
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

  async save(target: any): Promise<Invite> {
    const r = await this.connection.create({ ...target })
    return r.toObject()
  }

  async update(target: any, id: string): Promise<Invite> {
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
