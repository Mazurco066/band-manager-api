// Dependencies
import { IsString, IsNotEmpty, MinLength, MaxLength, IsEmail } from 'class-validator'

// API Documentation
import { ApiProperty } from '@nestjs/swagger'

export class AddAccountInput {
	@IsString({ message: 'Campo "username" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "username" não deve ser vazio' })
  @MinLength(2, { message: 'Campo "username" deve conter no mínimo 2 caracteres' })
  @MaxLength(128, { message: 'Campo "username" deve conter no máximo 128 caracteres' })
  @ApiProperty({ type: String, required: true, example: 'myusername' })
  username!: string

	@IsString({ message: 'Campo "name" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "name" não deve ser vazio' })
  @MinLength(2, { message: 'Campo "name" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "name" deve conter no máximo 256 caracteres' })
  @ApiProperty({ type: String, required: true, example: 'John Doe' })
	name!: string

	@IsString({ message: 'Campo "email" deve ser do tipo String' })
  @IsEmail({}, { message: 'Campo "email" deve ser um e-mail válido.' })
  @IsNotEmpty({ message: 'Campo "email" não deve ser vazio' })
  @ApiProperty({ type: String, required: true, example: 'myemail@gmail.com' })
  email!: string

	@IsString({ message: 'Campo "password" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "password" não deve ser vazio' })
  @MinLength(2, { message: 'Campo "password" deve conter no mínimo 2 caracteres' })
  @MaxLength(50, { message: 'Campo "password" deve conter no máximo 50 caracteres' })
  @ApiProperty({ type: String, required: true, example: 'strongpassword' })
	password!: string
}