// Dependencies
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { ObjectId } from 'mongodb'

// Domain Shared
import { UniqueEntityID, UniqueObjectID } from '@/domain/shared'

export type VerificationCodeDocument = VerificationCode & Document

@Schema({ autoCreate: true, autoIndex: true, timestamps: true, collection: 'VerificationCode' })
export class VerificationCode {
  @Prop({ type: String, default: () => new UniqueObjectID(), required: false })
  readonly _id: ObjectId

  @Prop({ immutable: true, required: true, type: String, index: true, default: () => new UniqueEntityID() })
  readonly id!: string

  @Prop({ required: true, type: String })
  code!: string

  @Prop({ type: String, ref: 'Account' })
  account!: string
}

export const VerificationCodeSchema = SchemaFactory.createForClass(VerificationCode)
