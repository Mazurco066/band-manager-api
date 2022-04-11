// Dependencies
import { Field, ID, ObjectType } from '@nestjs/graphql'

// Join types
import { AccountType } from '../../account'
import { BandType } from './band.type'

@ObjectType()
export class InviteType {
  @Field(() => ID)
	id!: string

  @Field(() => AccountType)
  account!: AccountType

  @Field(() => BandType)
  band!: BandType

  @Field(() => String)
  response: string

  @Field(() => Date)
  createdAt!: string

  @Field(() => Date)
  updatedAt!: string
}

@ObjectType()
export class BaseInviteType {
  @Field(() => ID)
	id!: string

  @Field(() => String)
  response: string

  @Field(() => Date)
  createdAt!: string

  @Field(() => Date)
  updatedAt!: string
}
