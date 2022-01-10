// Dependencies
import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsUUID } from 'class-validator'

@InputType()
export class UnlinkSongInput {
	@Field(() => String!)
	@IsNotEmpty({ message: 'Campo "showId" não deve ser vazio' })
	@IsUUID('4', { message: 'Campo "showId" deve ser do tipo UUID versão 4' })
	showId: string

  @Field(() => String!)
	@IsNotEmpty({ message: 'Campo "songId" não deve ser vazio' })
	@IsUUID('4', { message: 'Campo "songId" deve ser do tipo UUID versão 4' })
	songId: string
}
