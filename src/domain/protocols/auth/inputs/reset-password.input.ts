// Dependencies
import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsNotEmpty, MinLength, MaxLength, IsUUID } from 'class-validator'

@InputType()
export class ResetPasswordInput {
	@Field()
	@IsString({ message: 'Campo "token" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "token" não deve ser vazio' })
  @MinLength(32, { message: 'Campo "token" deve conter no mínimo 32 caracteres' })
  @MaxLength(64, { message: 'Campo "token" deve conter no máximo 64 caracteres' })
	token!: string

  @Field()
  @IsString({ message: 'Campo "newPassword" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "newPassword" não deve ser vazio' })
  @MinLength(2, { message: 'Campo "newPassword" deve conter no mínimo 2 caracteres' })
  @MaxLength(50, { message: 'Campo "newPassword" deve conter no máximo 50 caracteres' })
	newPassword!: string

  @Field()
  @IsNotEmpty({ message: 'Campo "accountId" não deve ser vazio' })
	@IsUUID('4', { message: 'Campo "accountId" deve ser do tipo UUID versão 4' })
	accountId!: string
}
