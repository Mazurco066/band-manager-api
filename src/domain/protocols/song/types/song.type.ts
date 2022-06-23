// Dependencies
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Song } from '@/domain/entities'

// Join types
import { BaseBandType } from '../../band'
import { BaseCategoryType } from './category.type'

@ObjectType()
export class SongType {
  @Field(() => ID)
	id!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  writter!: string

  @Field(() => String)
  description!: string

  @Field(() => String)
  tone!: string

  @Field(() => String)
  body!: string

  @Field(() => BaseBandType)
  band!: BaseBandType

  @Field(() => BaseCategoryType)
  category!: BaseCategoryType

  @Field(() => Boolean)
  isPublic: boolean

  @Field(() => String)
  createdAt!: string
 
  @Field(() => String)
  updatedAt!: string
}

@ObjectType()
export class BaseSongType {
  @Field(() => ID)
	id!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  writter!: string

  @Field(() => String)
  description!: string

  @Field(() => String)
  tone!: string

  @Field(() => String)
  body!: string

  @Field(() => Boolean)
  isPublic: boolean

  @Field(() => String)
  createdAt!: string

  @Field(() => String)
  updatedAt!: string
}

@ObjectType()
export class BandSongsType {
  @Field(() => Number)
  total!: number

  @Field(() => [SongType])
  data!: Song[]
}
