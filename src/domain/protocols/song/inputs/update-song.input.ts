// Dependencies
import { IsString, IsOptional, IsUUID, MinLength, MaxLength, IsBoolean } from 'class-validator'

export class UpdateSongInput {
  @IsOptional()
	@IsString({ message: 'Campo "title" deve ser do tipo String' })
  @MinLength(2, { message: 'Campo "title" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "title" deve conter no máximo 256 caracteres' })
	title?: string

  @IsOptional()
	@IsString({ message: 'Campo "tone" deve ser do tipo String' })
	tone?: string

  @IsOptional()
  @IsString({ message: 'Campo "writter" deve ser do tipo String' })
  @MinLength(2, { message: 'Campo "writter" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "writter" deve conter no máximo 256 caracteres' })
	writter?: string

  @IsOptional()
	@IsString({ message: 'Campo "body" deve ser do tipo String' })
	body?: string

  @IsOptional()
	@IsUUID('4', { message: 'Campo "category" deve ser do tipo UUID versão 4' })
	category?: string

  @IsOptional()
  @IsBoolean({ message: 'Campo "isPublic" deve ser do tipo booleano' })
  isPublic: boolean
}