// Dependencies
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { MongoError } from 'mongodb'

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
      throw new MongoError({ ...ex })
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
      return r

    } catch(ex) {
      console.error(ex)
      throw new MongoError({ ...ex })
    }
  }
  
  async generateResetPasswordToken(account: Account, token: string, resetPasswordToken: string): Promise<Auth> {
    try {
      return await new this.connection({
        account: account.id,
        token,
        resetPasswordToken,
        role: account.role
      }).save()
    } catch (ex) {
      console.error(ex)
      throw new MongoError({ ...ex })
    }
  }

  async updateResetPasswordToken(auth: Auth, resetPasswordToken: string): Promise<Auth> {
    try {
      return await this.connection.findOneAndUpdate({ _id: auth._id }, {
        resetPasswordToken,
        role: auth.role
      }, {
        new: true,
        useFindAndModify: false
      })
    } catch (ex) {
      console.error(ex)
      throw new MongoError({ ...ex })
    }
  }
}
