// Dependencies
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { ObjectId } from 'mongodb'

// Domain Shared
import { UniqueEntityID, UniqueObjectID } from '@/domain/shared'

export type BandDocument = Band & Document

@Schema({ autoCreate: true, autoIndex: true, timestamps: true, collection: 'Band' })
export class Band {
  @Prop({ type: String, default: () => new UniqueObjectID(), required: false })
  readonly _id: ObjectId

  @Prop({ immutable: true, required: true, type: String, index: true, default: () => new UniqueEntityID() })
  readonly id!: string

  @Prop({ required: true, type: String })
  title!: string

  @Prop({ required: true, type: String })
  description!: string

  @Prop({ type: String, ref: 'Account' })
  owner!: string

  @Prop({ type: [String], ref: 'Song', default: [] })
  directory: string[]

  @Prop({ type: [String], ref: 'Account', default: [] })
  admins: string[]

  @Prop({ type: [String], ref: 'Account', default: [] })
  members: string[]
}

export const BandSchema = SchemaFactory.createForClass(Band)
