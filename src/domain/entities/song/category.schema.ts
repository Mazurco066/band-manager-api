// Dependencies
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { ObjectId } from 'mongodb'

// Domain Shared
import { UniqueEntityID, UniqueObjectID } from '@/domain/shared'

export type CategoryDocument = Category & Document

@Schema({ autoCreate: true, autoIndex: true, timestamps: true, collection: 'Category' })
export class Category {
  @Prop({ type: String, default: () => new UniqueObjectID(), required: false })
  readonly _id: ObjectId

  @Prop({ immutable: true, required: true, type: String, index: true, default: () => new UniqueEntityID() })
  readonly id!: string

  @Prop({ required: true, type: String })
  title!: string

  @Prop({ required: false, default: '', type: String })
  description?: string

  @Prop({ type: String, ref: 'Band' })
  band!: string
}

export const CategorySchema = SchemaFactory.createForClass(Category)
