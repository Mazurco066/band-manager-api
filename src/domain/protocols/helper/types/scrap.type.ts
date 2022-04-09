// Dependencies
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ScrapType {

  @Field(() => String)
  loot!: string
}

