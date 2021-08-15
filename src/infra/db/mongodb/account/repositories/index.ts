import { Provider } from '@nestjs/common'

import { AccountRepository } from './account-repository'

export * from './account-repository'

export const AccountPersistenceProviders: Provider[] = [
  {
    provide: 'AccountRepository',
    useClass: AccountRepository
  }
]
