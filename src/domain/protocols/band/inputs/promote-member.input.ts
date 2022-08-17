// Dependencies
import { IsNotEmpty, IsUUID } from 'class-validator'

// API Documentation
import { ApiProperty } from '@nestjs/swagger'

export class PromoteMemberInput {
	@IsNotEmpty({ message: 'Campo "accountId" não deve ser vazio' })
	@IsUUID('4', { message: 'Campo "accountId" deve ser do tipo UUID versão 4' })
	@ApiProperty({ type: String, required: true, example: 'valid-uuid-v4-here' })
	accountId?: string
}