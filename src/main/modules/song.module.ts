// Dependencies
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

// Resolvers

// Commands & Queries
import { SongCommandHandlers, SongQueriesHandlers } from '@/data/usecases'

// Providers
import { SongPersistenceProviders } from '@/infra/db/mongodb'

// Schemas
import { Song, SongSchema } from '@/domain/entities/song'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Song.name, schema: SongSchema }])
  ],
  providers: [
    ...SongCommandHandlers,
    ...SongQueriesHandlers,
    ...SongPersistenceProviders
  ],
  exports: [
    ...SongPersistenceProviders
  ]
})
export class SongModule {}
