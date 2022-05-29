// Dependencies
import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsNotEmpty, MinLength, MaxLength, IsEmail } from 'class-validator'

@InputType()
export class AddAccountInput {
	@Field(() => String!)
	@IsString({ message: 'Campo "username" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "username" não deve ser vazio' })
  @MinLength(2, { message: 'Campo "username" deve conter no mínimo 2 caracteres' })
  @MaxLength(128, { message: 'Campo "username" deve conter no máximo 128 caracteres' })
  username!: string

	@Field(() => String!)
	@IsString({ message: 'Campo "name" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "name" não deve ser vazio' })
  @MinLength(2, { message: 'Campo "name" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "name" deve conter no máximo 256 caracteres' })
	name!: string

  @Field(() => String!)
	@IsString({ message: 'Campo "email" deve ser do tipo String' })
  @IsEmail({}, { message: 'Campo "email" deve ser um e-mail válido.' })
  @IsNotEmpty({ message: 'Campo "email" não deve ser vazio' })
  email!: string

	@Field(() => String!)
	@IsString({ message: 'Campo "password" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "password" não deve ser vazio' })
  @MinLength(2, { message: 'Campo "password" deve conter no mínimo 2 caracteres' })
  @MaxLength(50, { message: 'Campo "password" deve conter no máximo 50 caracteres' })
	password!: string
}