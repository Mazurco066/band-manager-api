// Dependencies
import { IsString, IsNotEmpty, MinLength, MaxLength, IsUUID, IsOptional, IsDateString } from 'class-validator'

export class UpdateShowInput {
  @IsOptional()
	@IsString({ message: 'Campo "title" deve ser do tipo String' })
  @MinLength(2, { message: 'Campo "title" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "title" deve conter no máximo 256 caracteres' })
	title!: string

  @IsOptional()
	@IsString({ message: 'Campo "description" deve ser do tipo String' })
  @MinLength(2, { message: 'Campo "description" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "description" deve conter no máximo 256 caracteres' })
	description!: string

  @IsOptional()
  @IsDateString({}, { message: 'Campo "date" deve ser do formato YYYY-MM-DD' })
  date: string
}
