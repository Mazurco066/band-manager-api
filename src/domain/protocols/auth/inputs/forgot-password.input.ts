// Dependencies
import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsNotEmpty, IsEmail } from 'class-validator'

@InputType()
export class ForgotPasswordInput {
	@Field()
	@IsString({ message: 'Campo "email" deve ser do tipo String' })
  @IsEmail({}, { message: 'Campo "email" deve ser um E-mail válido' })
  @IsNotEmpty({ message: 'Campo "email" não deve ser vazio' })
	email!: string;
}