// Dependencies
import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional, IsUUID } from 'class-validator'

@InputType()
export class AddCategoryInput {
	@Field(() => String!)
	@IsString({ message: 'Campo "title" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "title" não deve ser vazio' })
  @MinLength(2, { message: 'Campo "title" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "title" deve conter no máximo 256 caracteres' })
	title!: string

  @Field(() => String)
  @IsOptional()
	@IsString({ message: 'Campo "description" deve ser do tipo String' })
  @MinLength(2, { message: 'Campo "description" deve conter no mínimo 2 caracteres' })
  @MaxLength(512, { message: 'Campo "description" deve conter no máximo 512 caracteres' })
	description?: string

  @Field(() => String)
  @IsNotEmpty({ message: 'Campo "band" não deve ser vazio' })
	@IsUUID('4', { message: 'Campo "band" deve ser do tipo UUID versão 4' })
	band?: string
}