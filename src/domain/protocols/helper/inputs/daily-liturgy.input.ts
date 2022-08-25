// Dependencies
import { IsDateString, IsNotEmpty } from 'class-validator'

// API Documentation
import { ApiProperty } from '@nestjs/swagger'

export class DailyLiturgyInput {
	@IsDateString({}, { message: 'Campo "date" deve ser do formato YYYY-MM-DD' })
  @IsNotEmpty({ message: 'Campo "date" não deve ser vazio!' })
  @ApiProperty({ type: String, required: true, example: 'YYYY-MM-DD' })
	date: string
}
