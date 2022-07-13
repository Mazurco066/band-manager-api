// Dependencies
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ApolloError } from 'apollo-server-express'

// Domain
import { Show, ShowDocument } from '@/domain/entities/show'
import { Filter, Paging, IBaseRepository } from '@/domain/shared'

// Interfaces
export type IShowRepository = IBaseRepository<Show>

export class ShowRepository implements IShowRepository {
  constructor(
    @InjectModel(Show.name) private readonly connection: Model<ShowDocument>
  ) {}
  
  async find(params: Filter, pagingOptions?: Paging): Promise<Show[] | null> {
    const r = await this.connection
      .find({ ...params })
      .limit(pagingOptions?.limit || 0)
      .skip(pagingOptions?.offset || 0)
    return r
  }

  async findPopulated(params: Filter, pagingOptions?: Paging): Promise<Show[] | null> {
    const r = await this.connection
      .find({ ...params })
      .limit(pagingOptions?.limit || 0)
      .skip(pagingOptions?.offset || 0)
      .populate('band')
      .populate('songs')
    return r
  }

  async findShowsByBandPopulated(ids: string[], pagingOptions?: Paging): Promise<Show[] | null> {
    const r = await this.connection
      .find({ band: { $in: ids } })
      .limit(pagingOptions?.limit || 0)
      .skip(pagingOptions?.offset || 0)
      .populate('band')
      .populate('songs')
    return r
  }

  async findPendingPopulated(ids: string[], pagingOptions?: Paging): Promise<Show[] | null> {
    const currentDate = new Date()
    const r = await this.connection
      .find({
        band: { $in: ids },
        date: { $gte: new Date(currentDate.toISOString().split('T')[0]) }
      })
      .limit(pagingOptions?.limit || 0)
      .skip(pagingOptions?.offset || 0)
      .populate('band')
      .populate('songs')
    return r
  }

  async findOne(params: Filter): Promise<Show | null> {
    const r = await this.connection.findOne({ ...params })
    return r
  }

  async findOnePopulated(params: Filter): Promise<Show | null> {
    const r = await this.connection
      .findOne({ ...params })
      .populate('band')
      .populate('songs')
    return r
  }

  async delete(params: Filter): Promise<boolean> {
    try {

      const r = await this.connection.deleteOne({ ...params })
      return r.deletedCount > 0

    } catch(ex) {
      console.error(ex)
      throw new ApolloError('Erro ao remover show', '500')
    }
  }

  async exists(params: Filter): Promise<boolean> {
    return await this.connection.exists(params)
  }

  async save(target: any): Promise<Show> {
    const r = await this.connection.create({ ...target })
    return r
  }

  async update(target: any, id: string): Promise<Show> {
    try {
      const r = await this.connection.findOneAndUpdate({ id }, {
        ...target
      }, {
        new: true,
        useFindAndModify: false
      })
      return r

    } catch(ex) {
      console.error(ex)
      throw new ApolloError('Erro ao atualizar show', '500')
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
      return r

    } catch(ex) {
      console.error(ex)
      throw new ApolloError('Erro ao adicionar música na apresentação', '500')
    }
  }

  async removeSong(songs: string[], id: string): Promise<Show> {
    try {
      const r = await this.connection.findOneAndUpdate({ id }, {
        $set: { songs }
      }, { new: true, useFindAndModify: false })
      return r

    } catch(ex) {
      console.error(ex)
      throw new ApolloError('Erro ao remover música da apresentação', '500')
    }
  }
}
