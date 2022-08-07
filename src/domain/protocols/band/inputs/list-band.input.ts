// Dependencies
import { IsOptional, IsString } from 'class-validator'

export class ListBandsInput {
	@IsOptional()
  @IsString({ message: 'Campo "limit" deve ser do tipo String' })
  limit?: string

  @IsOptional()
  @IsString({ message: 'Campo "offset" deve ser do tipo String' })
  offset?: string
}
