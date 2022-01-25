import { LoadAccountByEmailHandler } from './load-account-by-email.query.handler'
import { LoadAccountByIdHandler } from './load-account.query.handler'
import { LoadMeHandler } from './load-me.query.handler'

export const AccountQueriesHandlers = [
  LoadAccountByEmailHandler,
  LoadAccountByIdHandler,
  LoadMeHandler
]
