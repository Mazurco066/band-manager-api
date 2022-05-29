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

  @Prop({
    required: false,
    type: String,
    default: 'https://res.cloudinary.com/r4kta/image/upload/v1653796384/playliter/avatar/sample_capr2m.jpg'
  })
  avatar?: string

  @Prop({ required: false, type: String, unique: true })
  email?: string

  @Prop({ required: false, type: Boolean, default: false })
  isEmailconfirmed?: boolean

  @Prop({ required: true, index: true, type: String, unique: true })
  username!: string

  @Prop({ required: true, type: String, default: RoleEnum.player })
  role!: RoleEnum

  @Prop({ required: true, type: String })
  name!: string

  @Prop({ type: String, required: true })
  password!: string
}

export const AccountSchema = SchemaFactory.createForClass(Account)
