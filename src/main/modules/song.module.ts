// Dependencies
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

// Resolvers~
import { SongResolvers } from '@/presentation/resolvers'

// Commands & Queries
import { SongCommandHandlers, SongQueriesHandlers } from '@/data/usecases'

// Providers
import { SongPersistenceProviders } from '@/infra/db/mongodb'

// Schemas
import { Song, SongSchema } from '@/domain/entities/song'

// External modules
import { AccountModule } from './account.module'
import { BandModule } from './band.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Song.name, schema: SongSchema }]),
    AccountModule,
    BandModule
  ],
  providers: [
    ...SongResolvers,
    ...SongCommandHandlers,
    ...SongQueriesHandlers,
    ...SongPersistenceProviders
  ],
  exports: [
    ...SongPersistenceProviders
  ]
})
export class SongModule {}
