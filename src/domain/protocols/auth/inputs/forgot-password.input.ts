// Dependencies
import { IsString, IsNotEmpty, IsEmail } from 'class-validator'

// API Documentation
import { ApiProperty } from '@nestjs/swagger'

export class ForgotPasswordInput {
	@IsString({ message: 'Campo "email" deve ser do tipo String' })
  @IsEmail({}, { message: 'Campo "email" deve ser um E-mail válido' })
  @IsNotEmpty({ message: 'Campo "email" não deve ser vazio' })
  @ApiProperty({ type: String, required: true, example: 'myemail@gmail.com' })
	email!: string;
}