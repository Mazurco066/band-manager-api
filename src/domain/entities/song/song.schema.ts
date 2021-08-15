// Dependencies
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { ObjectId } from 'mongodb'

// Domain Shared
import { UniqueEntityID, UniqueObjectID } from '@/domain/shared'

export type SongDocument = Song & Document

@Schema({ autoCreate: true, autoIndex: true, collection: 'Song' })
export class Song {
  @Prop({ type: String, default: () => new UniqueObjectID(), required: false })
  readonly _id: ObjectId

  @Prop({ immutable: true, required: true, type: String, index: true, default: () => new UniqueEntityID() })
  readonly id!: string

  @Prop({ required: true, type: String })
  title!: string

  @Prop({ required: true, type: String })
  url!: string

  @Prop({ required: false, type: String })
  tone: string
}

export const SongSchema = SchemaFactory.createForClass(Song)
