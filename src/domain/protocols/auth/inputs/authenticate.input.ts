// Dependencies
import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator'

@InputType()
export class AuthenticateInput {
	@Field()
	@IsString({ message: 'Campo "username" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "username" não deve ser vazio' })
	username!: string;

	@Field()
	@IsString({ message: 'Campo "password" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "password" não deve ser vazio' })
  @MinLength(2, { message: 'Campo "password" deve conter no mínimo 2 caracteres' })
  @MaxLength(50, { message: 'Campo "password" deve conter no máximo 50 caracteres' })
	password!: string;
}