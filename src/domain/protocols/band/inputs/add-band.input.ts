// Dependencies
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator'

export class AddBandInput {
	@IsString({ message: 'Campo "title" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "title" não deve ser vazio' })
  @MinLength(2, { message: 'Campo "title" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "title" deve conter no máximo 256 caracteres' })
	title!: string

	@IsString({ message: 'Campo "description" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "description" não deve ser vazio' })
  @MinLength(2, { message: 'Campo "description" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "description" deve conter no máximo 256 caracteres' })
	description!: string
}