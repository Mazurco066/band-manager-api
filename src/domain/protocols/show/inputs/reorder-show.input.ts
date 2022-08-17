// Dependencies
import { IsNotEmpty, IsArray } from 'class-validator'

// API Documentation
import { ApiProperty } from '@nestjs/swagger'

export class ReorderShowInput {
  @IsNotEmpty({ message: 'Campo "songs" não deve ser vazio' })
	@IsArray({ message: 'Campo "songs" deve ser do tipo Array' })
	@ApiProperty({ type: Array, required: false, example: "[\"valid-uuid-v4-here\",\"valid-uuid-v4-here\",\"valid-uuid-v4-here\",\"valid-uuid-v4-here\"]" })
	songs!: string[]
}
