import { ListBandsHandler } from './list-band.query.handler'
import { LoadBandByIdHandler } from './load-band.query.handler'
import { PendingInvitesHandler } from './pending-invites.query.handler'

export const BandQueriesHandlers = [
  ListBandsHandler,
  LoadBandByIdHandler,
  PendingInvitesHandler
]
