// Dependencies
import { Field, InputType } from '@nestjs/graphql'
import { IsUUID, IsNumber, IsOptional, Min } from 'class-validator'

@InputType()
export class ListCategoriesInput {
	@Field(() => String!)
	@IsUUID('4', { message: 'Campo "id" deve ser do tipo UUID versão 4' })
	bandId!: string

  @Field(() => Number)
  @IsOptional()
  @IsNumber({}, { message: 'Campo "limit" deve ser do tipo Number' })
  @Min(0, { message: 'Campo "limit" deve ser um número positivo' })
  limit?: number

  @Field(() => Number)
  @IsOptional()
  @IsNumber({}, { message: 'Campo "offset" deve ser do tipo Number' })
  @Min(0, { message: 'Campo "offset" deve ser um número positivo' })
  offset?: number
}