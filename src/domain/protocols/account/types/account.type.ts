// Dependencies
import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class AccountType {
  @Field(() => ID)
	id!: string

  @Field(() => String)
  username!: string

  @Field(() => String)
  role!: string

  @Field(() => String)
  email!: string

  @Field(() => String)
  created_at!: string

  @Field(() => String)
  updated_at!: string
}
