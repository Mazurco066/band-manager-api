// Dependencies
import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional, IsEmail } from 'class-validator'

// API Documentation
import { ApiProperty } from '@nestjs/swagger'

export class UpdateAccountInput {
	@IsString({ message: 'Campo "name" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "name" não deve ser vazio' })
  @MinLength(2, { message: 'Campo "name" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "name" deve conter no máximo 256 caracteres' })
  @ApiProperty({ type: String, required: false, example: 'John Doe' })
	name?: string

  @IsOptional()
	@IsString({ message: 'Campo "email" deve ser do tipo String' })
  @IsEmail({}, { message: 'Campo "email" deve ser um e-mail válido.' })
  @ApiProperty({ type: String, required: false, example: 'myemail@gmail.com' })
  email?: string

  @IsOptional()
  @IsString({ message: 'Campo "avatar" deve ser do tipo String' })
  @ApiProperty({ type: String, required: false, example: 'https://linktomyavatar.com' })
  avatar?: string

  @IsOptional()
  @ApiProperty({ type: String, required: false, example: 'oldpassword' })
	oldPassword?: string

  @IsOptional()
  @ApiProperty({ type: String, required: false, example: 'password' })
	password?: string

  @IsOptional()
  @ApiProperty({ type: String, required: false, example: 'password' })
	confirmPassword?: string
}