// Dependencies
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

// Resolvers~
import { SongControllers } from '@/presentation/controllers'
import { SongServices } from '@/presentation/services'

// Commands & Queries
import { SongCommandHandlers, SongQueriesHandlers } from '@/data/usecases'

// Providers
import { SongPersistenceProviders } from '@/infra/db/mongodb'

// Schemas
import { Category, CategorySchema, Song, SongSchema } from '@/domain/entities/song'

// External modules
import { AccountModule } from './account.module'
import { BandModule } from './band.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Song.name, schema: SongSchema }
    ]),
    AccountModule,
    BandModule
  ],
  controllers: [
    ...SongControllers
  ],
  providers: [
    ...SongServices,
    ...SongCommandHandlers,
    ...SongQueriesHandlers,
    ...SongPersistenceProviders
  ],
  exports: [
    ...SongPersistenceProviders
  ]
})
export class SongModule {}
