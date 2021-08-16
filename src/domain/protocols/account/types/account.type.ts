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
  name!: string

  @Field(() => String)
  createdAt!: string

  @Field(() => String)
  updatedAt!: string
}
