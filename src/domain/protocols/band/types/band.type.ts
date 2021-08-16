// Dependencies
import { Field, ID, ObjectType } from '@nestjs/graphql'

// Join types
import { AccountType } from '../../account'

@ObjectType()
export class BandType {
  @Field(() => ID)
	id!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  description!: string

  @Field(() => AccountType)
  owner!: AccountType

  @Field(() => [AccountType])
  members!: [AccountType]

  @Field(() => [AccountType])
  admins!: [AccountType]

  @Field(() => String)
  createdAt!: string

  @Field(() => String)
  updatedAt!: string
}

@ObjectType()
export class BaseBandType {
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
