// Dependencies
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator'

// API Documentation
import { ApiProperty } from '@nestjs/swagger'

export class VerifyAccountInput {
	@IsString({ message: 'Campo "code" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "code" não deve ser vazio' })
  @MinLength(4, { message: 'Campo "code" deve conter no mínimo 4 caracteres' })
  @MaxLength(4, { message: 'Campo "code" deve conter no máximo 4 caracteres' })
  @ApiProperty({ type: String, required: true, example: '1234' })
	code: string
}
