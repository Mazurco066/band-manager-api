// Dependencies
import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsNotEmpty, MinLength } from 'class-validator'

@InputType()
export class ScrapSongInput {
  @Field(() => String!)
	@IsString({ message: 'Campo "url" deve ser do tipo String' })
  @IsNotEmpty({ message: 'Campo "url" não deve ser vazio' })
  @MinLength(2, { message: 'Campo "url" deve conter no mínimo 2 caracteres' })
	url: string
}
