import { AuthenticateHandler } from './authenticate.command.handler'
import { ForgotPasswordHandler } from './forgot-password.command.handler'
import { ResetPasswordHandler } from './reset-password.command.handler'

export const AuthCommandHandlers = [
  AuthenticateHandler,
  ForgotPasswordHandler,
  ResetPasswordHandler
]
