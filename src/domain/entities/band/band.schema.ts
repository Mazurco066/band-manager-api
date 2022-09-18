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

  @Prop({
    required: false,
    type: String,
    default: 'https://res.cloudinary.com/r4kta/image/upload/v1663515679/playliter/logo/default_band_mklz55.png'
  })
  logo?: string

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
