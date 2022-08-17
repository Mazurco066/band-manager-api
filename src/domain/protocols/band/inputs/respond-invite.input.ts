// Dependencies
import { IsNotEmpty, IsString, IsUUID, IsIn } from 'class-validator'

// API Documentation
import { ApiProperty } from '@nestjs/swagger'

export class RespondInviteInput {
	@IsNotEmpty({ message: 'Campo "inviteId" não deve ser vazio' })
	@IsUUID('4', { message: 'Campo "inviteId" deve ser do tipo UUID versão 4' })
	@ApiProperty({ type: String, required: true, example: 'valid-uuid-v4-here' })
	inviteId?: string

  @IsString({ message: 'Campo "response" deve ser do tipo String' })
	@IsNotEmpty({ message: 'Campo "response" não deve ser vazio' })
  @IsIn(['accepted', 'denied'], { message: 'campo "response" deve ser "accepted" ou "denied"' })
	@ApiProperty({ type: String, required: true, example: 'accepted' })
	response?: string
}