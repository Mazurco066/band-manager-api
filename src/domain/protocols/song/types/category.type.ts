// Dependencies
import { Field, ID, ObjectType } from '@nestjs/graphql'

// Join types
import { BaseBandType } from '../../band'

@ObjectType()
export class CategoryType {
  @Field(() => ID)
	id!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  description?: string

  @Field(() => BaseBandType)
  band!: BaseBandType

  @Field(() => String)
  createdAt!: string
 
  @Field(() => String)
  updatedAt!: string
}

@ObjectType()
export class BaseCategoryType {
  @Field(() => ID)
	id!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  description?: string

  @Field(() => String)
  createdAt!: string
 
  @Field(() => String)
  updatedAt!: string
}

