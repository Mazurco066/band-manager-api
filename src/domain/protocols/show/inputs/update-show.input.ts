// Dependencies
import { IsString, MinLength, MaxLength, IsOptional, IsDateString } from 'class-validator'

// API Documentation
import { ApiProperty } from '@nestjs/swagger'

export class UpdateShowInput {
  @IsOptional()
	@IsString({ message: 'Campo "title" deve ser do tipo String' })
  @MinLength(2, { message: 'Campo "title" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "title" deve conter no máximo 256 caracteres' })
  @ApiProperty({ type: String, required: false, example: 'My show title' })
	title!: string

  @IsOptional()
	@IsString({ message: 'Campo "description" deve ser do tipo String' })
  @MinLength(2, { message: 'Campo "description" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "description" deve conter no máximo 256 caracteres' })
  @ApiProperty({ type: String, required: false, example: 'My show description' })
	description!: string

  @IsOptional()
  @IsDateString({}, { message: 'Campo "date" deve ser do formato YYYY-MM-DD' })
  @ApiProperty({ type: String, required: false, example: 'YYYY-MM-DD' })
  date: string
}
