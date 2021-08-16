// Dependencies
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ApolloError } from 'apollo-server-express'

// Domain
import { Song, SongDocument } from '@/domain/entities/song'
import { Filter, IBaseRepository } from '@/domain/shared'

// Interfaces
export type ISongRepository = IBaseRepository<Song>

export class SongRepository implements ISongRepository {
  constructor(
    @InjectModel(Song.name) private readonly connection: Model<SongDocument>
  ) {}
  
  async find(params: Filter): Promise<Song[] | null> {
    const r = await this.connection.find({ ...params })
    return r
  }

  async findOne(params: Filter): Promise<Song | null> {
    const r = await this.connection.findOne({ ...params })
    return r
  }

  async delete(params: Filter): Promise<boolean> {
    try {

      const r = await this.connection.deleteOne({ ...params })
      return r.deletedCount > 0

    } catch(ex) {
      console.error(ex)
      throw new ApolloError('Erro ao remover música', '500')
    }
  }

  async exists(params: Filter): Promise<boolean> {
    return await this.connection.exists(params)
  }

  async save(target: any): Promise<Song> {
    const r = await this.connection.create({ ...target })
    return r
  }

  async update(target: any, id: string): Promise<Song> {
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
      throw new ApolloError('Erro ao atualizar música', '500')
    }
  }
}
