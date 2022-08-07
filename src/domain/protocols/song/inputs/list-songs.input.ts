// Dependencies
import { IsNumber, IsOptional, IsString, Min } from 'class-validator'

export class ListSongsInput {
  @IsOptional()
  @IsNumber({}, { message: 'Campo "limit" deve ser do tipo Number' })
  @Min(0, { message: 'Campo "limit" deve ser um número positivo' })
  limit?: number

  @IsOptional()
  @IsNumber({}, { message: 'Campo "offset" deve ser do tipo Number' })
  @Min(0, { message: 'Campo "offset" deve ser um número positivo' })
  offset?: number

  @IsOptional()
  @IsString({ message: 'Campo "filter" deve ser do tipo String' })
  filter?: string
}