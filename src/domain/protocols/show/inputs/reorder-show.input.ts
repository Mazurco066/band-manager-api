// Dependencies
import { IsNotEmpty, IsArray } from 'class-validator'

export class ReorderShowInput {
  @IsNotEmpty({ message: 'Campo "songs" não deve ser vazio' })
	@IsArray({ message: 'Campo "songs" deve ser do tipo Array' })
	songs!: string[]
}
