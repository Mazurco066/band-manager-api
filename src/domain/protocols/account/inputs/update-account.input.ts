// Dependencies
import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional, IsUUID, IsEmail } from 'class-validator'

@InputType()
export class UpdateAccountInput {
  @Field(() => String!)
  @IsNotEmpty({ message: 'Campo "id" não deve ser vazio' })
	@IsUUID('4', { message: 'Campo "id" deve ser do tipo UUID versão 4' })
	id!: string

	@Field(() => String!)
	@IsString({ message: 'Campo "name" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "name" não deve ser vazio' })
  @MinLength(2, { message: 'Campo "name" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "name" deve conter no máximo 256 caracteres' })
	name!: string

  @Field(() => String)
  @IsOptional()
	@IsString({ message: 'Campo "email" deve ser do tipo String' })
  @IsEmail({}, { message: 'Campo "email" deve ser um e-mail válido.' })
  email!: string

  @Field(() => String)
  @IsOptional()
  @IsString({ message: 'Campo "avatar" deve ser do tipo String' })
  avatar?: string

  @Field(() => String)
  @IsOptional()
	oldPassword?: string

	@Field(() => String)
  @IsOptional()
	password?: string

  @Field(() => String)
  @IsOptional()
	confirmPassword?: string
}