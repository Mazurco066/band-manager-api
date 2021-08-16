import { Provider } from '@nestjs/common'

import { ShowRepository } from './show-repository'

export * from './show-repository'

export const ShowPersistenceProviders: Provider[] = [
  {
    provide: 'ShowRepository',
    useClass: ShowRepository
  }
]
