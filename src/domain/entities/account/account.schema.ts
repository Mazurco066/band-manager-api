// Dependencies
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { ObjectId } from 'mongodb'

// Domain Protocols
import { RoleEnum } from '@/domain/protocols'

// Domain Shared
import { UniqueEntityID, UniqueObjectID } from '@/domain/shared'

export type AccountDocument = Account & Document

@Schema({ autoCreate: true, autoIndex: true, timestamps: true, collection: 'Account' })
export class Account {
  @Prop({ type: String, default: () => new UniqueObjectID(), required: false })
  readonly _id: ObjectId

  @Prop({ immutable: true, required: true, type: String, index: true, default: () => new UniqueEntityID() })
  readonly id!: string

  @Prop({ required: true, index: true, type: String })
  username!: string

  @Prop({ required: true, type: String, default: RoleEnum.player })
  role!: RoleEnum

  @Prop({ required: true, type: String, unique: true })
  name!: string

  @Prop({ type: String, required: true })
  password!: string
}

export const AccountSchema = SchemaFactory.createForClass(Account)
