// Dependencies
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { MongoError } from 'mongodb'

// Domain
import { Band, BandDocument } from '@/domain/entities/band'
import { Filter, IBaseRepository, Paging } from '@/domain/shared'

// Interfaces
export type IBandRepository = IBaseRepository<Band>

export class BandRepository implements IBandRepository {
  constructor(
    @InjectModel(Band.name) private readonly connection: Model<BandDocument>
  ) {}
  
  async find(params: Filter, pagingOptions?: Paging): Promise<Band[] | null> {
    const options = pagingOptions ? pagingOptions : { limit: 0, offset: 0 }
    const r = await this.connection
      .find({ ...params })
      .limit(options.limit || 0)
      .skip(options.offset || 0)
      .populate('owner')
      .populate('members')
      .populate('directory')
      .populate('admins')
      .lean()
    return r
  }

  async findPopulated(params: Filter, pagingOptions?: Paging): Promise<Band[] | null> {
    const options = pagingOptions ? pagingOptions : { limit: 0, offset: 0 }
    const r = await this.connection
      .find({ ...params })
      .limit(options.limit || 0)
      .skip(options.offset || 0)
      .populate('owner')
      .populate('members')
      .populate('directory')
      .populate('admins')
      .lean()
    return r
  }

  async findOne(params: Filter): Promise<Band | null> {
    const r = await this.connection.findOne({ ...params })
    return r ? r.toObject() : r
  }

  async findOnePopulated(params: Filter): Promise<Band | null> {
    const r = await this.connection
      .findOne({ ...params })
      .populate('owner')
      .populate('members')
      .populate('directory')
      .populate('admins')
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

  async save(target: any): Promise<Band> {
    const r = await this.connection.create({ ...target })
    return r.toObject()
  }

  async update(target: any, id: string): Promise<Band> {
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

  async addMember(members: string[], newMember: string, id: string): Promise<Band> {
    try {
      const r = await this.connection.findOneAndUpdate({ id }, {
        $set: {
          members: [ ...members, newMember ]
        }
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

  async promoteMember(admins: string[], newAdmin: string, id: string): Promise<Band> {
    try {
      const r = await this.connection.findOneAndUpdate({ id }, {
        $set: {
          admins: [ ...admins, newAdmin ]
        }
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

  async removeMember(admins: string[], members: string[], id: string): Promise<Band> {
    try {
      const r = await this.connection.findOneAndUpdate({ id }, {
        $set: { admins, members }
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
