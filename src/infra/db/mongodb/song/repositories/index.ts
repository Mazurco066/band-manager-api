import { Provider } from '@nestjs/common'

import { CategoryRepository } from './category-repository'
import { SongRepository } from './song-repository'

export * from './category-repository'
export * from './song-repository'

export const SongPersistenceProviders: Provider[] = [
  {
    provide: 'CategoryRepository',
    useClass: CategoryRepository
  },
  {
    provide: 'SongRepository',
    useClass: SongRepository
  }
]
