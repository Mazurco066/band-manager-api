import { LoadPendingShowsHandler } from './get-pending-shows.query.handler'
import { ListShowsHandler } from './list-shows.query.handler'
import { LoadShowHandler } from './get-show.query.handler'

export const ShowQueriesHandlers = [
  LoadPendingShowsHandler,
  ListShowsHandler,
  LoadShowHandler
]
