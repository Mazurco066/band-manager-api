import { LoadPendingShowsHandler } from './get-pending-shows.query.handler'
import { ListShowsHandler } from './list-shows.query.handler'
import { ListShowsHandlerV2 } from './list-shows-v2.query.handler'
import { ListShowsByAccountHandler } from './list-shows-by-account.query.handler'
import { LoadShowHandler } from './get-show.query.handler'

export const ShowQueriesHandlers = [
  LoadPendingShowsHandler,
  ListShowsHandler,
  ListShowsHandlerV2,
  ListShowsByAccountHandler,
  LoadShowHandler
]
