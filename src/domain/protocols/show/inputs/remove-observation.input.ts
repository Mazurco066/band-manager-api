// Dependencies
import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsUUID } from 'class-validator'

@InputType()
export class RemoveObservationInput {
  @Field(() => String)
  @IsNotEmpty({ message: 'Campo "show" não deve ser vazio' })
	@IsUUID('4', { message: 'Campo "show" deve ser do tipo UUID versão 4' })
	show: string

  @Field(() => String)
  @IsNotEmpty({ message: 'Campo "id" não deve ser vazio' })
	@IsUUID('4', { message: 'Campo "id" deve ser do tipo UUID versão 4' })
	id: string
}
