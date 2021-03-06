// Dependencies
import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsNotEmpty, MinLength, MaxLength, IsUUID, IsBoolean, IsOptional } from 'class-validator'

@InputType()
export class AddSongInput {
	@Field(() => String!)
	@IsString({ message: 'Campo "title" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "title" não deve ser vazio' })
  @MinLength(2, { message: 'Campo "title" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "title" deve conter no máximo 256 caracteres' })
	title!: string

  @Field(() => String!)
	@IsString({ message: 'Campo "writter" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "writter" não deve ser vazio' })
  @MinLength(2, { message: 'Campo "writter" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "writter" deve conter no máximo 256 caracteres' })
	writter!: string

  @Field(() => String!)
	@IsString({ message: 'Campo "tone" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "tone" não deve ser vazio' })
	tone!: string

  @Field(() => String!)
	@IsString({ message: 'Campo "body" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "body" não deve ser vazio' })
	body!: string

  @Field(() => String!)
  @IsNotEmpty({ message: 'Campo "band" não deve ser vazio' })
	@IsUUID('4', { message: 'Campo "band" deve ser do tipo UUID versão 4' })
	band!: string

  @Field(() => String!)
  @IsNotEmpty({ message: 'Campo "category" não deve ser vazio' })
	@IsUUID('4', { message: 'Campo "category" deve ser do tipo UUID versão 4' })
	category!: string

  @Field(() => Boolean)
  @IsOptional()
  @IsBoolean({ message: 'Campo "isPublic" deve ser do tipo booleano' })
  isPublic: boolean
}