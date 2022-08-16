// Dependencies
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { MongoError } from 'mongodb'

// Domain
import { Song, SongDocument } from '@/domain/entities/song'
import { Filter, Paging, IBaseRepository } from '@/domain/shared'

// Interfaces
export type ISongRepository = IBaseRepository<Song>

export class SongRepository implements ISongRepository {
  constructor(
    @InjectModel(Song.name) private readonly connection: Model<SongDocument>
  ) {}
  
  async find(params: Filter, pagingOptions?: Paging): Promise<Song[] | null> {
    const r = await this.connection
      .find({ ...params })
      .limit(pagingOptions?.limit || 0)
      .skip(pagingOptions?.offset || 0)
      .lean()
    return r
  }

  async findPopulated(params: Filter, pagingOptions?: Paging): Promise<Song[] | null> {
    const r = await this.connection
      .find({ ...params })
      .limit(pagingOptions?.limit || 0)
      .skip(pagingOptions?.offset || 0)
      .populate('band')
      .populate('category')
      .lean()
    return r
  }

  async findFilteredPopulated(bandId: string, filter: string, pagingOptions?: Paging, sorting?: string): Promise<Song[] | null> {
    const r = await this.connection
      .find({
        $or: [
          { title: new RegExp(filter, 'i') },
          { writter: new RegExp(filter, 'i') }
        ],
        band: bandId
      })
      .sort(sorting || 'title')
      .limit(pagingOptions?.limit || 0)
      .skip(pagingOptions?.offset || 0)
      .populate('band')
      .populate('category')
      .lean()
    return r
  }

  async findPublicPopulated(params: string, pagingOptions?: Paging, sorting?: string): Promise<Song[] | null> {
    const r = await this.connection
      .find({
        $or: [
          { title: new RegExp(params, 'i') },
          { writter: new RegExp(params, 'i') }
        ],
        isPublic: true
      })
      .sort(sorting || 'title')
      .limit(pagingOptions?.limit || 0)
      .skip(pagingOptions?.offset || 0)
      .populate('band')
      .populate('category')
      .lean()
    return r
  }

  async findOne(params: Filter): Promise<Song | null> {
    const r = await this.connection.findOne({ ...params })
    return r.toObject()
  }

  async findOnePopulated(params: Filter): Promise<Song | null> {
    const r = await this.connection
      .findOne({ ...params })
      .populate('band')
      .populate('category')
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

  async count(params: Filter): Promise<number> {
    return await this.connection.countDocuments(params)
  }

  async customCount(bandId: string, filter: string): Promise<number> {
    return await this.connection.countDocuments({
      $or: [
        { title: new RegExp(filter, 'i') },
        { writter: new RegExp(filter, 'i') }
      ],
      band: bandId
    })
  }

  async save(target: any): Promise<Song> {
    const r = await this.connection.create({ ...target })
    return r.toObject()
  }

  async update(target: any, id: string): Promise<Song> {
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
