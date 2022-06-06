import { AddAccountHandler } from './add-account.command.handler'
import { RemoveAccountHandler } from './remove-account.command.handler'
import { UpdateAccountHandler } from './update-account.command.handler'
import { VerifyAccountHandler } from './verify-account.command.handler'

export const AccountCommandHandlers = [
  AddAccountHandler,
  RemoveAccountHandler,
  UpdateAccountHandler,
  VerifyAccountHandler
]
