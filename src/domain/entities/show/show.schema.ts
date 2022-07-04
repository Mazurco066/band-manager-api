// Dependencies
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { ObjectId } from 'mongodb'

// Domain Shared
import { UniqueEntityID, UniqueObjectID } from '@/domain/shared'

export type ShowDocument = Show & Document

@Schema()
export class Observation {
  @Prop({ required: true, type: String })
  id: string

  @Prop({ type: String, required: true })
  title: string

  @Prop({ type: String, required: true })
  data: string
}

@Schema({ autoCreate: true, autoIndex: true, timestamps: true, collection: 'Show' })
export class Show {
  @Prop({ type: String, default: () => new UniqueObjectID(), required: false })
  readonly _id: ObjectId

  @Prop({ immutable: true, required: true, type: String, index: true, default: () => new UniqueEntityID() })
  readonly id!: string

  @Prop({ required: true, type: String })
  title!: string

  @Prop({ required: true, type: String })
  description!: string

  @Prop({ required: true, type: Date })
  date: Date

  @Prop({ type: [String], ref: 'Song', default: [] })
  songs: string[]

  @Prop({ type: String, ref: 'Band' })
  band!: string

  // Observation schema
  @Prop({ type: Array, required: true })
  observations: Observation[]
}

export const ShowSchema = SchemaFactory.createForClass(Show)
