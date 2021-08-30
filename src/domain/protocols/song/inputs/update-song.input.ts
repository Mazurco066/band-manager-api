// Dependencies
import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsOptional, IsNotEmpty, IsUUID, MinLength, MaxLength } from 'class-validator'

@InputType()
export class UpdateSongInput {
  @Field(() => String)
	@IsNotEmpty({ message: 'Campo "id" não deve ser vazio' })
	@IsUUID('4', { message: 'Campo "id" deve ser do tipo UUID versão 4' })
	id: string

	@Field(() => String)
  @IsOptional()
	@IsString({ message: 'Campo "title" deve ser do tipo String' })
  @MinLength(2, { message: 'Campo "title" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "title" deve conter no máximo 256 caracteres' })
	title?: string

  @Field(() => String)
  @IsOptional()
  @IsString({ message: 'Campo "writter" deve ser do tipo String' })
  @MinLength(2, { message: 'Campo "writter" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "writter" deve conter no máximo 256 caracteres' })
	writter?: string

  @Field(() => String)
  @IsOptional()
	@IsString({ message: 'Campo "body" deve ser do tipo String' })
	body?: string

  @Field(() => String)
  @IsOptional()
	@IsUUID('4', { message: 'Campo "category" deve ser do tipo UUID versão 4' })
	category?: string
}