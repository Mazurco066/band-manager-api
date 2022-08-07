// Dependencies
import { IsString, IsNotEmpty, MinLength, MaxLength, IsUUID, IsDateString } from 'class-validator'

export class AddShowInput {
	@IsString({ message: 'Campo "title" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "title" não deve ser vazio' })
  @MinLength(2, { message: 'Campo "title" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "title" deve conter no máximo 256 caracteres' })
	title: string

	@IsString({ message: 'Campo "description" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "description" não deve ser vazio' })
  @MinLength(2, { message: 'Campo "description" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "description" deve conter no máximo 256 caracteres' })
	description: string

  @IsNotEmpty({ message: 'Campo "band" não deve ser vazio' })
	@IsUUID('4', { message: 'Campo "band" deve ser do tipo UUID versão 4' })
	band: string

  @IsDateString({}, { message: 'Campo "date" deve ser do formato YYYY-MM-DD' })
  @IsNotEmpty({ message: 'Campo "date" não deve ser vazio!' })
  date: string
}
