// Dependencies
import { IsNotEmpty, IsUUID } from 'class-validator'

export class DemoteMemberInput {
	@IsNotEmpty({ message: 'Campo "bandId" não deve ser vazio' })
	@IsUUID('4', { message: 'Campo "bandId" deve ser do tipo UUID versão 4' })
	bandId?: string

	@IsNotEmpty({ message: 'Campo "accountId" não deve ser vazio' })
	@IsUUID('4', { message: 'Campo "accountId" deve ser do tipo UUID versão 4' })
	accountId?: string
}