// Dependencies
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { ObjectId } from 'mongodb'

// Domain Shared
import { UniqueEntityID, UniqueObjectID } from '@/domain/shared'

export type ShowDocument = Show & Document

@Schema({ autoCreate: true, autoIndex: true, collection: 'Show' })
export class Show {
  @Prop({ type: String, default: () => new UniqueObjectID(), required: false })
  readonly _id: ObjectId

  @Prop({ immutable: true, required: true, type: String, index: true, default: () => new UniqueEntityID() })
  readonly id!: string

  @Prop({ required: true, type: String })
  title!: string

  @Prop({ required: true, type: String })
  description!: string

  @Prop({ type: [ObjectId], ref: 'Song', default: [] })
  songs: ObjectId[]
}

export const ShowSchema = SchemaFactory.createForClass(Show)
