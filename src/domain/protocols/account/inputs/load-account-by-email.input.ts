// Dependencies
import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class LoadAccountByEmailInput {
	@Field(() => String!)
	@IsString({ message: 'Campo "username" deve ser do tipo String' })
	username!: string
}