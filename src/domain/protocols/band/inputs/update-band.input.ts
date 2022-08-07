// Dependencies
import { IsString, MinLength, MaxLength, IsOptional, IsNotEmpty, IsUUID } from 'class-validator'

export class UpdateBandInput {
	@IsNotEmpty({ message: 'Campo "id" não deve ser vazio' })
	@IsUUID('4', { message: 'Campo "id" deve ser do tipo UUID versão 4' })
	id: string

  @IsOptional()
	@IsString({ message: 'Campo "title" deve ser do tipo String' })
  @MinLength(2, { message: 'Campo "title" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "title" deve conter no máximo 256 caracteres' })
	title?: string

  @IsOptional()
	@IsString({ message: 'Campo "description" deve ser do tipo String' })
  @MinLength(2, { message: 'Campo "description" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "description" deve conter no máximo 256 caracteres' })
	description?: string
}