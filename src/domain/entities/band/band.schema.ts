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

  @Prop({ type: [ObjectId], ref: 'Song', default: [] })
  directory: ObjectId[]

  @Prop({ type: String, ref: 'Account' })
  owner!: ObjectId

  @Prop({ type: [ObjectId], ref: 'Account', default: [] })
  admins: ObjectId[]

  @Prop({ type: [ObjectId], ref: 'Account', default: [] })
  members: ObjectId[]

  @Prop({ type: [ObjectId], ref: 'Show', default: [] })
  shows: ObjectId[]
}

export const BandSchema = SchemaFactory.createForClass(Band)
