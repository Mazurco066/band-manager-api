// Dependencies
import { IsNumberString, IsOptional } from 'class-validator'

// API Documentation
import { ApiProperty } from '@nestjs/swagger'

export class ListAccountsInput {
  @IsOptional()
  @IsNumberString({}, { message: 'Campo "limit" deve ser do tipo Number' })
  @ApiProperty({ type: String, required: false, example: '0' })
  limit?: number

  @IsOptional()
  @IsNumberString({}, { message: 'Campo "offset" deve ser do tipo Number' })
  @ApiProperty({ type: String, required: false, example: '0' })
  offset?: number
}