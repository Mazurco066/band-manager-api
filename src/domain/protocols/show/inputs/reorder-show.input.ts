// Dependencies
import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsUUID,IsArray } from 'class-validator'

@InputType()
export class ReorderShowInput {
  @Field(() => String!)
	@IsNotEmpty({ message: 'Campo "id" não deve ser vazio' })
	@IsUUID('4', { message: 'Campo "id" deve ser do tipo UUID versão 4' })
	id!: string

	@Field(() => [String]!)
  @IsNotEmpty({ message: 'Campo "songs" não deve ser vazio' })
	@IsArray({ message: 'Campo "songs" deve ser do tipo Array' })
	songs!: string[]
}
