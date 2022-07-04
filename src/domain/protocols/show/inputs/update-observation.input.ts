// Dependencies
import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsNotEmpty, MinLength, MaxLength, IsUUID } from 'class-validator'

@InputType()
export class UpdateObservationInput {
	@Field(() => String)
	@IsString({ message: 'Campo "title" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "title" não deve ser vazio' })
  @MinLength(2, { message: 'Campo "title" deve conter no mínimo 2 caracteres' })
  @MaxLength(256, { message: 'Campo "title" deve conter no máximo 256 caracteres' })
	title: string

  @Field(() => String)
	@IsString({ message: 'Campo "data" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "data" não deve ser vazio' })
  @MinLength(2, { message: 'Campo "data" deve conter no mínimo 2 caracteres' })
	data: string

  @Field(() => String)
  @IsNotEmpty({ message: 'Campo "show" não deve ser vazio' })
	@IsUUID('4', { message: 'Campo "show" deve ser do tipo UUID versão 4' })
	show: string

  @Field(() => String)
  @IsNotEmpty({ message: 'Campo "id" não deve ser vazio' })
	@IsUUID('4', { message: 'Campo "id" deve ser do tipo UUID versão 4' })
	id: string
}
