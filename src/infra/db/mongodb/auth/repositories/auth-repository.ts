// Dependencies
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ApolloError } from 'apollo-server-express'

// Domain
import { Auth, AuthDocument } from '@/domain/entities/auth'
import { Filter, IBaseRepository } from '@/domain/shared'
import { Account } from '@/domain/entities'

// Interfaces
export type IAuthRepository = IBaseRepository<Auth>

export class AuthRepository implements IAuthRepository {
  constructor(
    @InjectModel(Auth.name) private readonly connection: Model<AuthDocument>
  ) {}
  
  find(params: Filter): Promise<Auth[] | null> {
    throw new Error('Method not implemented')
  }

  async findOne(params: Filter): Promise<Auth | null> {
    const r = await this.connection.findOne({ ...params })
    return r
  }

  delete(params: Filter): Promise<boolean> {
    throw new Error('Method not implemented')
  }

  async exists(params: Filter): Promise<boolean> {
    return await this.connection.exists(params)
  }

  async save(target: Auth): Promise<Auth> {
    const account = new this.connection(target)
    return await account.save()
  }

  async generateToken(account: Account, token: string): Promise<Auth> {
    try {

      const authentication = new this.connection({
        account: account.id,
        token,
        role: account.role
      })

      return await authentication.save()

    } catch(ex) {
      console.error(ex)
      throw new ApolloError('Erro ao gerar token de acesso para conta informada', '500')
    }
  }

  async updateToken(account: Account, token: string): Promise<Auth> {
    try {

      const r = await this.connection.findOneAndUpdate({ account: account.id }, {
        token,
        role: account.role
      }, {
        new: true,
        useFindAndModify: false
      })

      if (r) return r
      else throw new ApolloError('Erro ao atualizar token de acesso para conta informada', '404')

    } catch(ex) {
      console.error(ex)
      throw new ApolloError('Erro ao atualizar token de acesso para conta informada', '500')
    }
  }
}
