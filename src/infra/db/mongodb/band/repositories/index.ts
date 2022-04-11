import { Provider } from '@nestjs/common'

import { BandRepository } from './band-repository'
import { InviteRepository } from './invite-repository'

export * from './band-repository'
export * from './invite-repository'

export const BandPersistenceProviders: Provider[] = [
  {
    provide: 'BandRepository',
    useClass: BandRepository
  },
  {
    provide: 'InviteRepository',
    useClass: InviteRepository
  }
]
