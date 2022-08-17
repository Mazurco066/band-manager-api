// Dependencies
import { IsString, IsNotEmpty, MinLength, MaxLength, IsUUID, IsDateString } from 'class-validator'

// API Documentation
import { ApiProperty } from '@nestjs/swagger'

export class AddShowInput {
	@IsString({ message: 'Campo "title" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "title" não deve ser vazio' })
  @MinLength(2, { message: 'Campo "title" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "title" deve conter no máximo 256 caracteres' })
  @ApiProperty({ type: String, required: true, example: 'My show title' })
	title: string

	@IsString({ message: 'Campo "description" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "description" não deve ser vazio' })
  @MinLength(2, { message: 'Campo "description" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "description" deve conter no máximo 256 caracteres' })
  @ApiProperty({ type: String, required: true, example: 'My show description' })
	description: string

  @IsNotEmpty({ message: 'Campo "band" não deve ser vazio' })
	@IsUUID('4', { message: 'Campo "band" deve ser do tipo UUID versão 4' })
  @ApiProperty({ type: String, required: true, example: 'valid-uuid-v4-here' })
	band: string

  @IsDateString({}, { message: 'Campo "date" deve ser do formato YYYY-MM-DD' })
  @IsNotEmpty({ message: 'Campo "date" não deve ser vazio!' })
  @ApiProperty({ type: String, required: true, example: 'YYYY-MM-DD' })
  date: string
}
