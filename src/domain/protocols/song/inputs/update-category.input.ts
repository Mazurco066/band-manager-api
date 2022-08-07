// Dependencies
import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator'

export class UpdateCategoryInput {
  @IsOptional()
	@IsString({ message: 'Campo "title" deve ser do tipo String' })
  @MinLength(2, { message: 'Campo "title" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "title" deve conter no máximo 256 caracteres' })
	title!: string

  @IsOptional()
	@IsString({ message: 'Campo "description" deve ser do tipo String' })
  @MinLength(2, { message: 'Campo "description" deve conter no mínimo 2 caracteres' })
  @MaxLength(512, { message: 'Campo "description" deve conter no máximo 512 caracteres' })
	description?: string
}