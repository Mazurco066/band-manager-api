// Dependencies
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { MongoError } from 'mongodb'
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
    const r = await this.connection.find({ ...params }).lean()
    return r
  }

  async findOne(params: Filter): Promise<Account | null> {
    const r = await this.connection.findOne({ ...params })
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

  async save(target: any): Promise<Account> {
    const encrypter = new BcryptAdapter()
    const encodedPasswd = await encrypter.encrypt(target.password)
    const account = await this.connection.create({
      ...target,
      password: encodedPasswd
    })
    return account.toObject()
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
      return account.toObject()

    } catch(ex) {
      console.error(ex)
      throw new MongoError({ ...ex })
    }
  }

  async changePassword(password: string, params: Filter): Promise<Account> {
    try {

      const encrypter = new BcryptAdapter()
      const encodedPassword = await encrypter.encrypt(password)
      const account = await this.connection.findOneAndUpdate(params, {
        $set: { password: encodedPassword }
      }, {
        new: true,
        useFindAndModify: false
      })
      return account.toObject()

    } catch(ex) {
      console.error(ex)
      throw new MongoError({ ...ex })
    }
  }
}
