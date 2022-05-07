// Dependencies
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { ObjectId } from 'mongodb'

// Domain Shared
import { UniqueEntityID, UniqueObjectID } from '@/domain/shared'

export type SongDocument = Song & Document

@Schema({ autoCreate: true, autoIndex: true, timestamps: true, collection: 'Song' })
export class Song {
  @Prop({ type: String, default: () => new UniqueObjectID(), required: false })
  readonly _id: ObjectId

  @Prop({ immutable: true, required: true, type: String, index: true, default: () => new UniqueEntityID() })
  readonly id!: string

  @Prop({ required: true, type: String })
  title!: string

  @Prop({ required: true, type: String })
  writter!: string

  @Prop({ required: true, type: String })
  tone!: string

  @Prop({ required: true, type: String })
  body!: string

  @Prop({ type: String, ref: 'Band' })
  band!: string

  @Prop({ type: String, ref: 'Category' })
  category!: string

  @Prop({ type: Boolean, default: false })
  isPublic!: boolean
}

export const SongSchema = SchemaFactory.createForClass(Song)
