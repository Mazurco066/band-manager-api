// Dependencies
import { Field, ID, ObjectType } from '@nestjs/graphql'

// Join types
import { BaseBandType } from '../../band'
import { BaseSongType } from '../../song'

@ObjectType()
export class ShowType {
  @Field(() => ID)
	id!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  description!: string

  @Field(() => BaseBandType)
  band!: BaseBandType

  @Field(() => Date)
  date!: string

  @Field(() => [BaseSongType])
  songs!: [BaseSongType]

  @Field(() => String)
  createdAt!: string

  @Field(() => String)
  updatedAt!: string
}

@ObjectType()
export class BaseShowType {
  @Field(() => ID)
	id!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  description!: string

  @Field(() => String)
  band!: string

  @Field(() => Date)
  date!: string

  @Field(() => [String])
  songs!: string[]

  @Field(() => String)
  createdAt!: string

  @Field(() => String)
  updatedAt!: string
}
