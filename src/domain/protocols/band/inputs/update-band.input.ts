// Dependencies
import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator'

// API Documentation
import { ApiProperty } from '@nestjs/swagger'

export class UpdateBandInput {
  @IsOptional()
	@IsString({ message: 'Campo "title" deve ser do tipo String' })
  @MinLength(2, { message: 'Campo "title" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "title" deve conter no máximo 256 caracteres' })
  @ApiProperty({ type: String, required: false, example: 'My Awesome band' })
	title?: string

  @IsOptional()
	@IsString({ message: 'Campo "description" deve ser do tipo String' })
  @MinLength(2, { message: 'Campo "description" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "description" deve conter no máximo 256 caracteres' })
  @ApiProperty({ type: String, required: false, example: 'My band description' })
	description?: string

  @IsOptional()
	@IsString({ message: 'Campo "logo" deve ser do tipo String' })
  @MinLength(2, { message: 'Campo "logo" deve conter no mínimo 2 caracteres' })
  @MaxLength(640, { message: 'Campo "logo" deve conter no máximo 256 caracteres' })
  @ApiProperty({ type: String, required: false, example: 'https://cdn.com.br/logo.png' })
	logo?: string
}