// Dependencies
import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, IsUUID, IsIn } from 'class-validator'

@InputType()
export class RespondInviteInput {
	@Field(() => String)
	@IsNotEmpty({ message: 'Campo "inviteId" não deve ser vazio' })
	@IsUUID('4', { message: 'Campo "inviteId" deve ser do tipo UUID versão 4' })
	inviteId?: string

  @Field(() => String)
  @IsString({ message: 'Campo "response" deve ser do tipo String' })
	@IsNotEmpty({ message: 'Campo "response" não deve ser vazio' })
  @IsIn(['accepted', 'denied'], { message: 'campo "response" deve ser "accepted" ou "denied"' })
	response?: string
}