// Dependencies
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { ObjectId } from 'mongodb'

// Domain Shared
import { UniqueEntityID, UniqueObjectID } from '@/domain/shared'

// Enums
import { ResponseEnum } from '@/domain/protocols'

export type InviteDocument = Invite & Document

@Schema({ autoCreate: true, autoIndex: true, timestamps: true, collection: 'Invite' })
export class Invite {
  @Prop({ type: String, default: () => new UniqueObjectID(), required: false })
  readonly _id: ObjectId

  @Prop({ immutable: true, required: true, type: String, index: true, default: () => new UniqueEntityID() })
  readonly id!: string

  @Prop({ type: String, ref: 'Account' })
  account!: string

  @Prop({ type: String, ref: 'Band' })
  band!: string
  
  @Prop({ type: String, required: false, default: ResponseEnum.pending })
  response?: ResponseEnum
}

export const InviteSchema = SchemaFactory.createForClass(Invite)