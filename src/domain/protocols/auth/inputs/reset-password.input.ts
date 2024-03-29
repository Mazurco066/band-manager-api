// Dependencies
import { IsString, IsNotEmpty, MinLength, MaxLength, IsUUID } from 'class-validator'

// API Documentation
import { ApiProperty } from '@nestjs/swagger'

export class ResetPasswordInput {
	@IsString({ message: 'Campo "token" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "token" não deve ser vazio' })
  @MinLength(32, { message: 'Campo "token" deve conter no mínimo 32 caracteres' })
  @MaxLength(64, { message: 'Campo "token" deve conter no máximo 64 caracteres' })
  @ApiProperty({ type: String, required: true, example: 'reset-token-here' })
	token!: string

  @IsString({ message: 'Campo "newPassword" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "newPassword" não deve ser vazio' })
  @MinLength(2, { message: 'Campo "newPassword" deve conter no mínimo 2 caracteres' })
  @MaxLength(50, { message: 'Campo "newPassword" deve conter no máximo 50 caracteres' })
  @ApiProperty({ type: String, required: true, example: 'mynewpassword' })
	newPassword!: string
}
