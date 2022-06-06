import { Provider } from '@nestjs/common'

import { AccountRepository } from './account-repository'
import { VerificationRepository } from './verification-repository'

export * from './account-repository'
export * from './verification-repository'

export const AccountPersistenceProviders: Provider[] = [
  {
    provide: 'AccountRepository',
    useClass: AccountRepository
  },{
    provide: 'VerificationRepository',
    useClass: VerificationRepository
  }
]
