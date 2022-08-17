// Dependencies
import { IsString } from 'class-validator'

// API Documentation
import { ApiProperty } from '@nestjs/swagger'

export class LoadAccountByEmailInput {
	@IsString({ message: 'Campo "username" deve ser do tipo String' })
	@ApiProperty({ type: String, required: true, example: 'myusername' })
	username!: string
}