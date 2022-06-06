// Dependencies
import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator'

@InputType()
export class VerifyAccountInput {
	@Field()
	@IsString({ message: 'Campo "code" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "code" não deve ser vazio' })
  @MinLength(4, { message: 'Campo "code" deve conter no mínimo 4 caracteres' })
  @MaxLength(4, { message: 'Campo "code" deve conter no máximo 4 caracteres' })
	code: string
}
