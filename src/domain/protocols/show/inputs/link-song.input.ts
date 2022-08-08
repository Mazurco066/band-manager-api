// Dependencies
import { IsNotEmpty, IsUUID } from 'class-validator'

export class LinkSongInput {
	@IsNotEmpty({ message: 'Campo "songId" não deve ser vazio' })
	@IsUUID('4', { message: 'Campo "songId" deve ser do tipo UUID versão 4' })
	songId: string
}
