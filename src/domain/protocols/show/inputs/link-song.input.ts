// Dependencies
import { IsNotEmpty, IsUUID } from 'class-validator'

export class LinkSongInput {
	@IsNotEmpty({ message: 'Campo "showId" não deve ser vazio' })
	@IsUUID('4', { message: 'Campo "showId" deve ser do tipo UUID versão 4' })
	showId: string

	@IsNotEmpty({ message: 'Campo "songId" não deve ser vazio' })
	@IsUUID('4', { message: 'Campo "songId" deve ser do tipo UUID versão 4' })
	songId: string
}
