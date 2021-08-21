// Dependencies
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ApolloError } from 'apollo-server-express'

// Domain
import { Band, BandDocument } from '@/domain/entities/band'
import { Filter, IBaseRepository } from '@/domain/shared'

// Interfaces
export type IBandRepository = IBaseRepository<Band>

export class BandRepository implements IBandRepository {
  constructor(
    @InjectModel(Band.name) private readonly connection: Model<BandDocument>
  ) {}
  
  async find(params: Filter): Promise<Band[] | null> {
    const r = await this.connection
      .find({ ...params })
      .populate('owner')
      .populate('members')
      .populate('directory')
      .populate('admins')
    return r
  }

  async findOne(params: Filter): Promise<Band | null> {
    const r = await this.connection.findOne({ ...params })
    return r
  }

  async findOnePopulated(params: Filter): Promise<Band | null> {
    const r = await this.connection
      .findOne({ ...params })
      .populate('owner')
      .populate('members')
      .populate('directory')
      .populate('admins')
    return r
  }

  async delete(params: Filter): Promise<boolean> {
    try {

      const r = await this.connection.deleteOne({ ...params })
      return r.deletedCount > 0

    } catch(ex) {
      console.error(ex)
      throw new ApolloError('Erro ao remover banda', '500')
    }
  }

  async exists(params: Filter): Promise<boolean> {
    return await this.connection.exists(params)
  }

  async save(target: any): Promise<Band> {
    const r = await (await this.connection.create({ ...target }))
    return r
  }

  async update(target: any, id: string): Promise<Band> {
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
      throw new ApolloError('Erro ao atualizar banda', '500')
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
      return r

    } catch(ex) {
      console.error(ex)
      throw new ApolloError('Erro ao adicionar membro na banda', '500')
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
      return r

    } catch(ex) {
      console.error(ex)
      throw new ApolloError('Erro ao adicionar membro na banda', '500')
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
      return r

    } catch(ex) {
      console.error(ex)
      throw new ApolloError('Erro ao adicionar membro na banda', '500')
    }
  }
}
