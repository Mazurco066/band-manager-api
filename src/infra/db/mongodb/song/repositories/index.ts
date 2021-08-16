import { Provider } from '@nestjs/common'

import { SongRepository } from './song-repository'

export * from './song-repository'

export const SongPersistenceProviders: Provider[] = [
  {
    provide: 'SongRepository',
    useClass: SongRepository
  }
]
