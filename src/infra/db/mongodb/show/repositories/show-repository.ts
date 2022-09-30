// Dependencies
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { MongoError } from 'mongodb'

// Domain
import { Show, ShowDocument } from '@/domain/entities/show'
import { Filter, Paging, IBaseRepository } from '@/domain/shared'

// Interfaces
export type IShowRepository = IBaseRepository<Show>

export class ShowRepository implements IShowRepository {
  constructor(
    @InjectModel(Show.name) private readonly connection: Model<ShowDocument>
  ) {}
  
  async find(params: Filter, pagingOptions?: Paging, sorting?: string): Promise<Show[] | null> {
    const r = await this.connection
      .find({ ...params })
      .sort(sorting || { 'date': -1 })
      .limit(pagingOptions?.limit || 0)
      .skip(pagingOptions?.offset || 0)
      .lean()
    return r
  }

  async findPopulated(params: Filter, pagingOptions?: Paging, sorting?: string): Promise<Show[] | null> {
    const r = await this.connection
      .find({ ...params })
      .sort(sorting || { 'date': -1 })
      .limit(pagingOptions?.limit || 0)
      .skip(pagingOptions?.offset || 0)
      .populate('band')
      .populate('songs')
      .lean()
    return r
  }

  async findShowsByBandPopulated(ids: string[], pagingOptions?: Paging, sorting?: string): Promise<Show[] | null> {
    const r = await this.connection
      .find({ band: { $in: ids } })
      .sort(sorting || { 'date': -1 })
      .limit(pagingOptions?.limit || 0)
      .skip(pagingOptions?.offset || 0)
      .populate('band')
      .populate('songs')
      .lean()
    return r
  }

  async findPendingPopulated(ids: string[], pagingOptions?: Paging, sorting?: string): Promise<Show[] | null> {
    const currentDate = new Date()
    const r = await this.connection
      .find({
        band: { $in: ids },
        date: { $gte: new Date(currentDate.toISOString().split('T')[0]) }
      })
      .sort(sorting || { 'date': 1 })
      .limit(pagingOptions?.limit || 0)
      .skip(pagingOptions?.offset || 0)
      .populate('band')
      .populate('songs')
      .lean()
    return r
  }

  async findOne(params: Filter): Promise<Show | null> {
    const r = await this.connection.findOne({ ...params })
    return r ? r.toObject() : r
  }

  async findOnePopulated(params: Filter): Promise<Show | null> {
    const r = await this.connection
      .findOne({ ...params })
      .populate('band')
      .populate('songs')
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

  async save(target: any): Promise<Show> {
    const r = await this.connection.create({ ...target })
    return r.toObject()
  }

  async update(target: any, id: string): Promise<Show> {
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

  async addSong(songs: string[], newSong: string, id: string): Promise<Show> {
    try {
      const r = await this.connection.findOneAndUpdate({ id }, {
        $set: {
          songs: [ ...songs, newSong ]
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

  async removeSong(songs: string[], id: string): Promise<Show> {
    try {
      const r = await this.connection.findOneAndUpdate({ id }, {
        $set: { songs }
      }, { new: true, useFindAndModify: false })
      return r.toObject()

    } catch(ex) {
      console.error(ex)
      throw new MongoError({ ...ex })
    }
  }
}
