// Dependencies
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ApolloError } from 'apollo-server-express'

// Domain
import { Show, ShowDocument } from '@/domain/entities/show'
import { Filter, IBaseRepository } from '@/domain/shared'

// Interfaces
export type IShowRepository = IBaseRepository<Show>

export class ShowRepository implements IShowRepository {
  constructor(
    @InjectModel(Show.name) private readonly connection: Model<ShowDocument>
  ) {}
  
  async find(params: Filter): Promise<Show[] | null> {
    const r = await this.connection.find({ ...params })
    return r
  }

  async findOne(params: Filter): Promise<Show | null> {
    const r = await this.connection.findOne({ ...params })
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
}
