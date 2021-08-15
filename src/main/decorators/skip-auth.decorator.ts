// Dependencies
import { SetMetadata, applyDecorators } from '@nestjs/common'

// Decorators
import { ROLES } from './roles.decorator'

// Set metatada for auth skip
export const SKIP_AUTH = 'SKIP_AUTH'
export const SkipAuth = (skipAuth = true) => applyDecorators(
  SetMetadata(SKIP_AUTH, skipAuth), 
  SetMetadata(ROLES, null)
)
