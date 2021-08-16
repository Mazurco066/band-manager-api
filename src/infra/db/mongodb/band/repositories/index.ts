import { Provider } from '@nestjs/common'

import { BandRepository } from './band-repository'

export * from './band-repository'

export const BandPersistenceProviders: Provider[] = [
  {
    provide: 'BandRepository',
    useClass: BandRepository
  }
]
