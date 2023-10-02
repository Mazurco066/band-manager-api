// Dependencies
import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional } from 'class-validator'

// API Documentation
import { ApiProperty } from '@nestjs/swagger'

export class AddBandInput {
	@IsString({ message: 'Campo "title" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "title" não deve ser vazio' })
  @MinLength(2, { message: 'Campo "title" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "title" deve conter no máximo 256 caracteres' })
  @ApiProperty({ type: String, required: true, example: 'My Awesome band' })
	title!: string

	@IsString({ message: 'Campo "description" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "description" não deve ser vazio' })
  @MinLength(2, { message: 'Campo "description" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "description" deve conter no máximo 256 caracteres' })
  @ApiProperty({ type: String, required: true, example: 'My band description' })
	description!: string

  @IsOptional()
  @IsString({ message: 'Campo "logo" deve ser do tipo String' })
  @MinLength(2, { message: 'Campo "logo" deve conter no mínimo 2 caracteres' })
  @MaxLength(640, { message: 'Campo "logo" deve conter no máximo 256 caracteres' })
  @ApiProperty({ type: String, required: false, example: 'http://cdn.com/logo.png' })
	logo?: string
}