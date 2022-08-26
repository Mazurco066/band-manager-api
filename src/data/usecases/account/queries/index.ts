import { ListAccountsHandler } from './list-accounts.query.handler'
import { LoadAccountByEmailHandler } from './load-account-by-email.query.handler'
import { LoadAccountByIdHandler } from './load-account.query.handler'
import { LoadMeHandler } from './load-me.query.handler'

export const AccountQueriesHandlers = [
  ListAccountsHandler,
  LoadAccountByEmailHandler,
  LoadAccountByIdHandler,
  LoadMeHandler
]
