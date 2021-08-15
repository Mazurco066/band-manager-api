// Dependencies
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { ObjectId } from 'mongodb'

// Domain Protocols
import { RoleEnum } from '@/domain/protocols'

// Domain Shared
import { UniqueEntityID, UniqueObjectID } from '@/domain/shared'

export type AuthDocument = Auth & Document

@Schema({ autoCreate: true, autoIndex: true, timestamps: true, collection: 'Auth' })
export class Auth {
  @Prop({ type: String, default: () => new UniqueObjectID(), required: false })
  readonly _id: ObjectId

  @Prop({ immutable: true, required: true, type: String, index: true, default: () => new UniqueEntityID() })
  readonly id!: string

  @Prop({ type: String, ref: 'Account' })
  account!: ObjectId

  @Prop({ required: true, type: String })
  token!: string

  @Prop({ required: false, type: String})
  role!: RoleEnum
}

export const AuthSchema = SchemaFactory.createForClass(Auth)
