// Dependencies
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ScrapType {

  @Field(() => String)
  loot!: string

  @Field(() => String)
  tone!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  writter!: string
}

