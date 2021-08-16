// Dependencies
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

// Resolvers

// Commands & Queries
import { BandCommandHandlers, BandQueriesHandlers } from '@/data/usecases'

// Providers
import { BandPersistenceProviders } from '@/infra/db/mongodb'

// Schemas
import { Band, BandSchema } from '@/domain/entities/band'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Band.name, schema: BandSchema }])
  ],
  providers: [
    ...BandCommandHandlers,
    ...BandQueriesHandlers,
    ...BandPersistenceProviders
  ],
  exports: [
    ...BandPersistenceProviders
  ]
})
export class BandModule {}
