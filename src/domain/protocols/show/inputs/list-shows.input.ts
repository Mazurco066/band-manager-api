// Dependencies
import { IsNumberString, IsOptional } from 'class-validator'

export class ListShowsInput {
  @IsOptional()
  @IsNumberString({}, { message: 'Campo "limit" deve ser do tipo Number' })
  limit?: number

  @IsOptional()
  @IsNumberString({}, { message: 'Campo "offset" deve ser do tipo Number' })
  offset?: number
}
