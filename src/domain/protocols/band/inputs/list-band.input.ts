// Dependencies
import { IsOptional, IsNumberString } from 'class-validator'

// API Documentation
import { ApiProperty } from '@nestjs/swagger'

export class ListBandsInput {
	@IsOptional()
  @IsNumberString({} ,{ message: 'Campo "limit" deve ser do tipo String' })
  @ApiProperty({ type: String, required: false, example: '0' })
  limit?: string

  @IsOptional()
  @IsNumberString({}, { message: 'Campo "offset" deve ser do tipo String' })
  @ApiProperty({ type: String, required: false, example: '0' })
  offset?: string
}
