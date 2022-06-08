import { AddAccountHandler } from './add-account.command.handler'
import { RemoveAccountHandler } from './remove-account.command.handler'
import { ResendVerificationHandler } from './resend-verification.command.handler'
import { UpdateAccountHandler } from './update-account.command.handler'
import { VerifyAccountHandler } from './verify-account.command.handler'

export const AccountCommandHandlers = [
  AddAccountHandler,
  RemoveAccountHandler,
  ResendVerificationHandler,
  UpdateAccountHandler,
  VerifyAccountHandler
]
