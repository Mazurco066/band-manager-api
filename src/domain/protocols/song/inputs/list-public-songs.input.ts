// Dependencies
import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsNumber, IsOptional, Min } from 'class-validator'

@InputType()
export class ListPublicSongsInput {
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

  @Field(() => String)
  @IsOptional()
  @IsString({ message: 'Campo "filter" deve ser do tipo String' })
  filter?: string
}