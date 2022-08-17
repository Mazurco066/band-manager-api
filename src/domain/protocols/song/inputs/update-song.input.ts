// Dependencies
import { IsString, IsOptional, IsUUID, MinLength, MaxLength, IsBoolean } from 'class-validator'

// API Documentation
import { ApiProperty } from '@nestjs/swagger'

export class UpdateSongInput {
  @IsOptional()
	@IsString({ message: 'Campo "title" deve ser do tipo String' })
  @MinLength(2, { message: 'Campo "title" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "title" deve conter no máximo 256 caracteres' })
  @ApiProperty({ type: String, required: false, example: 'Butterflies' })
	title?: string

  @IsOptional()
	@IsString({ message: 'Campo "tone" deve ser do tipo String' })
  @ApiProperty({ type: String, required: false, example: 'E' })
	tone?: string

  @IsOptional()
  @IsString({ message: 'Campo "writter" deve ser do tipo String' })
  @MinLength(2, { message: 'Campo "writter" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "writter" deve conter no máximo 256 caracteres' })
  @ApiProperty({ type: String, required: false, example: 'Michael Bay' })
	writter?: string

  @IsOptional()
	@IsString({ message: 'Campo "body" deve ser do tipo String' })
  @ApiProperty({ type: String, required: false, example: 'Haha my song body' })
	body?: string

  @IsOptional()
	@IsUUID('4', { message: 'Campo "category" deve ser do tipo UUID versão 4' })
  @ApiProperty({ type: String, required: false, example: 'valid-uuid-v4-here' })
	category?: string

  @IsOptional()
  @IsBoolean({ message: 'Campo "isPublic" deve ser do tipo booleano' })
  @ApiProperty({ type: Boolean, required: false, example: true })
  isPublic: boolean
}