// Dependencies
import { IsString, IsNotEmpty, MinLength } from 'class-validator'

// API Documentation
import { ApiProperty } from '@nestjs/swagger'

export class ScrapSongInput {
	@IsString({ message: 'Campo "url" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "url" não deve ser vazio' })
  @MinLength(2, { message: 'Campo "url" deve conter no mínimo 2 caracteres' })
  @ApiProperty({ type: String, required: true, example: 'https://cifraclub.com/link-para-musica' })
	url: string
}
