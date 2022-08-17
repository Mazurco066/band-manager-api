// Dependencies
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

// Retrieve jwt user from token
export const JwtUserDecorator = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().user
  }
)
