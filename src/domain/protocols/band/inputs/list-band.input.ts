// Dependencies
import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType()
export class ListBandsInput {
  @Field(() => String)
	@IsOptional()
  @IsString({ message: 'Campo "limit" deve ser do tipo String' })
  limit?: string

  @Field(() => String)
  @IsOptional()
  @IsString({ message: 'Campo "offset" deve ser do tipo String' })
  offset?: string
}
