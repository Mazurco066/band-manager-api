// Dependencies
import { IsString, IsNotEmpty, MinLength, MaxLength, IsUUID } from 'class-validator'

export class UpdateObservationInput {
	@IsString({ message: 'Campo "title" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "title" não deve ser vazio' })
  @MinLength(2, { message: 'Campo "title" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "title" deve conter no máximo 256 caracteres' })
	title: string

	@IsString({ message: 'Campo "data" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "data" não deve ser vazio' })
  @MinLength(2, { message: 'Campo "data" deve conter no mínimo 2 caracteres' })
	data: string
}
