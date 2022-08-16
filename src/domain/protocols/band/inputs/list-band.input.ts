// Dependencies
import { IsOptional, IsNumberString } from 'class-validator'

export class ListBandsInput {
	@IsOptional()
  @IsNumberString({} ,{ message: 'Campo "limit" deve ser do tipo String' })
  limit?: string

  @IsOptional()
  @IsNumberString({}, { message: 'Campo "offset" deve ser do tipo String' })
  offset?: string
}
