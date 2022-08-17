// Dependencies
import { IsString, IsNotEmpty, MinLength, MaxLength, IsUUID, IsBoolean, IsOptional } from 'class-validator'

// API Documentation
import { ApiProperty } from '@nestjs/swagger'

export class AddSongInput {
	@IsString({ message: 'Campo "title" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "title" não deve ser vazio' })
  @MinLength(2, { message: 'Campo "title" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "title" deve conter no máximo 256 caracteres' })
  @ApiProperty({ type: String, required: true, example: 'Butterflies' })
	title!: string

	@IsString({ message: 'Campo "writter" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "writter" não deve ser vazio' })
  @MinLength(2, { message: 'Campo "writter" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "writter" deve conter no máximo 256 caracteres' })
  @ApiProperty({ type: String, required: true, example: 'Michael Bay' })
	writter!: string

	@IsString({ message: 'Campo "tone" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "tone" não deve ser vazio' })
  @ApiProperty({ type: String, required: true, example: 'E' })
	tone!: string

	@IsString({ message: 'Campo "body" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "body" não deve ser vazio' })
  @ApiProperty({ type: String, required: true, example: 'Haha my song body' })
	body!: string

  @IsNotEmpty({ message: 'Campo "category" não deve ser vazio' })
	@IsUUID('4', { message: 'Campo "category" deve ser do tipo UUID versão 4' })
  @ApiProperty({ type: String, required: true, example: 'valid-uuid-v4-here' })
	category!: string

  @IsOptional()
  @IsBoolean({ message: 'Campo "isPublic" deve ser do tipo booleano' })
  @ApiProperty({ type: Boolean, required: true, example: true })
  isPublic: boolean
}