// Dependencies
import { IsString } from 'class-validator'

export class LoadAccountByEmailInput {
	@IsString({ message: 'Campo "username" deve ser do tipo String' })
	username!: string
}