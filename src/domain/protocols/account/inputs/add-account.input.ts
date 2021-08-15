// Dependencies
import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator'

@InputType()
export class AddAccountInput {
	@Field()
	@IsString({ message: 'Campo "username" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "username" não deve ser vazio' })
  @MinLength(2, { message: 'Campo "username" deve conter no mínimo 2 caracteres' })
  @MaxLength(255, { message: 'Campo "username" deve conter no máximo 255 caracteres' })
  username!: string

	@Field()
	@IsString({ message: 'Campo "email" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "email" não deve ser vazio' })
  @IsEmail({}, { message: 'Campo "email" deve conter um E-mail válido' })
	email!: string

	@Field()
	@IsString({ message: 'Campo "password" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "password" não deve ser vazio' })
  @MinLength(2, { message: 'Campo "password" deve conter no mínimo 2 caracteres' })
  @MaxLength(50, { message: 'Campo "password" deve conter no máximo 50 caracteres' })
	password!: string
}