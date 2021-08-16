// Dependencies
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ApolloError } from 'apollo-server-express'
import { BcryptAdapter } from '@/infra/criptography'

// Domain
import { Account, AccountDocument } from '@/domain/entities/account'
import { Filter, IBaseRepository } from '@/domain/shared'

// Interfaces
export type IAccountRepository = IBaseRepository<Account>

export class AccountRepository implements IAccountRepository {
  constructor(
    @InjectModel(Account.name) private readonly connection: Model<AccountDocument>
  ) {}
  
  async find(params: Filter): Promise<Account[] | null> {
    const r = await this.connection.find({ ...params })
    return r
  }

  async findOne(params: Filter): Promise<Account | null> {
    const r = await this.connection.findOne({ ...params })
    return r
  }

  async delete(params: Filter): Promise<boolean> {
    try {

      const r = await this.connection.deleteOne({ ...params })
      return r.deletedCount > 0

    } catch(ex) {
      console.error(ex)
      throw new ApolloError('Erro ao remover conta', '500')
    }
  }

  async exists(params: Filter): Promise<boolean> {
    return await this.connection.exists(params)
  }

  async save(target: any): Promise<Account> {
    const encrypter = new BcryptAdapter()
    const encodedPasswd = await encrypter.encrypt(target.password)
    const account = await this.connection.create({
      ...target,
      password: encodedPasswd
    })
    return account
  }

  async update(target: any, id: string): Promise<Account> {
    try {

      const encrypter = new BcryptAdapter()
      const encodedPasswd = target.password ? await encrypter.encrypt(target.password) : ''
      const account = await this.connection.findOneAndUpdate({ id }, encodedPasswd ? {
        ...target, password: encodedPasswd
      } : { ...target }, {
        new: true,
        useFindAndModify: false
      })
      return account

    } catch(ex) {
      console.error(ex)
      throw new ApolloError('Erro ao atualizar conta', '500')
    }
  }
}
