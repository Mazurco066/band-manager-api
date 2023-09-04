// Dependencies
import { IsNotEmpty, IsDateString } from 'class-validator'

// API Documentation
import { ApiProperty } from '@nestjs/swagger'

export class CloneConcertInput {
  @IsDateString({}, { message: 'Campo "date" deve ser do formato YYYY-MM-DD' })
  @IsNotEmpty({ message: 'Campo "date" não deve ser vazio!' })
  @ApiProperty({ type: String, required: true, example: 'YYYY-MM-DD' })
  date: string
}
