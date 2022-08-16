// Dependencies
import { IsNumberString, IsOptional, IsString } from 'class-validator'

export class ListSongsInput {
  @IsOptional()
  @IsNumberString({}, { message: 'Campo "limit" deve ser do tipo Number' })
  limit?: number

  @IsOptional()
  @IsNumberString({}, { message: 'Campo "offset" deve ser do tipo Number' })
  offset?: number

  @IsOptional()
  @IsString({ message: 'Campo "filter" deve ser do tipo String' })
  filter?: string
}