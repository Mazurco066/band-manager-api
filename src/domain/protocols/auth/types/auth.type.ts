// Dependencies
import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class AuthType {
  @Field(() => ID)
	id!: string
}

@ObjectType()
export class TokenType {
  @Field(() => String)
  token!: string
}
