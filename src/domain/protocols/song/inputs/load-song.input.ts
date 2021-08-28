// Dependencies
import { Field, InputType } from '@nestjs/graphql'
import { IsUUID } from 'class-validator'

@InputType()
export class LoadSongByIdInput {
	@Field(() => String!)
	@IsUUID('4', { message: 'Campo "id" deve ser do tipo UUID versão 4' })
	id!: string

	@Field(() => String!)
	@IsUUID('4', { message: 'Campo "id" deve ser do tipo UUID versão 4' })
	bandId!: string
}