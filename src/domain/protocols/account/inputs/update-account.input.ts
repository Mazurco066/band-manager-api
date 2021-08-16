// Dependencies
import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional, IsUUID } from 'class-validator'

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
	@IsString({ message: 'Campo "oldPassword" deve ser do tipo String' })
  @MinLength(2, { message: 'Campo "oldPassword" deve conter no mínimo 2 caracteres' })
  @MaxLength(50, { message: 'Campo "oldPassword" deve conter no máximo 50 caracteres' })
	oldPassword?: string

	@Field(() => String)
  @IsOptional()
	@IsString({ message: 'Campo "password" deve ser do tipo String' })
  @MinLength(2, { message: 'Campo "password" deve conter no mínimo 2 caracteres' })
  @MaxLength(50, { message: 'Campo "password" deve conter no máximo 50 caracteres' })
	password?: string

  @Field(() => String)
  @IsOptional()
	@IsString({ message: 'Campo "confirmPassword" deve ser do tipo String' })
  @MinLength(2, { message: 'Campo "confirmPassword" deve conter no mínimo 2 caracteres' })
  @MaxLength(50, { message: 'Campo "confirmPassword" deve conter no máximo 50 caracteres' })
	confirmPassword?: string
}