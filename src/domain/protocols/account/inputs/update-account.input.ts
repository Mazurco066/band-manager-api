// Dependencies
import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional, IsEmail } from 'class-validator'

export class UpdateAccountInput {
	@IsString({ message: 'Campo "name" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "name" não deve ser vazio' })
  @MinLength(2, { message: 'Campo "name" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "name" deve conter no máximo 256 caracteres' })
	name!: string

  @IsOptional()
	@IsString({ message: 'Campo "email" deve ser do tipo String' })
  @IsEmail({}, { message: 'Campo "email" deve ser um e-mail válido.' })
  email!: string

  @IsOptional()
  @IsString({ message: 'Campo "avatar" deve ser do tipo String' })
  avatar?: string

  @IsOptional()
	oldPassword?: string

  @IsOptional()
	password?: string

  @IsOptional()
	confirmPassword?: string
}