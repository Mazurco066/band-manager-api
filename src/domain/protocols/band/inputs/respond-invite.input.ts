// Dependencies
import { IsNotEmpty, IsString, IsUUID, IsIn } from 'class-validator'

export class RespondInviteInput {
	@IsNotEmpty({ message: 'Campo "inviteId" não deve ser vazio' })
	@IsUUID('4', { message: 'Campo "inviteId" deve ser do tipo UUID versão 4' })
	inviteId?: string

  @IsString({ message: 'Campo "response" deve ser do tipo String' })
	@IsNotEmpty({ message: 'Campo "response" não deve ser vazio' })
  @IsIn(['accepted', 'denied'], { message: 'campo "response" deve ser "accepted" ou "denied"' })
	response?: string
}