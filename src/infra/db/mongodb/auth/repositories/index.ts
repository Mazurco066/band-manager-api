import { Provider } from '@nestjs/common'

import { AuthRepository } from './auth-repository'

export * from './auth-repository'

export const AuthPersistenceProviders: Provider[] = [
  {
    provide: 'AuthRepository',
    useClass: AuthRepository
  }
]
