import { AuthenticateHandler } from './authenticate.command.handler'
import { ForgotPasswordHandler } from './forgot-password.command.handler'

export const AuthCommandHandlers = [
  AuthenticateHandler,
  ForgotPasswordHandler
]