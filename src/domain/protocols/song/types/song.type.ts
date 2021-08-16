// Dependencies
import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SongType {
  @Field(() => ID)
	id!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  description!: string

  @Field(() => String)
  createdAt!: string

  @Field(() => String)
  updatedAt!: string
}
