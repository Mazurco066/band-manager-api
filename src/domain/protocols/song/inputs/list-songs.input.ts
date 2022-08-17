// Dependencies
import { IsNumberString, IsOptional, IsString } from 'class-validator'

// API Documentation
import { ApiProperty } from '@nestjs/swagger'

export class ListSongsInput {
  @IsOptional()
  @IsNumberString({}, { message: 'Campo "limit" deve ser do tipo Number' })
  @ApiProperty({ type: String, required: false, example: '0' })
  limit?: number

  @IsOptional()
  @IsNumberString({}, { message: 'Campo "offset" deve ser do tipo Number' })
  @ApiProperty({ type: String, required: false, example: '0' })
  offset?: number

  @IsOptional()
  @IsString({ message: 'Campo "filter" deve ser do tipo String' })
  @ApiProperty({ type: String, required: false, example: 'some filter here...' })
  filter?: string
}