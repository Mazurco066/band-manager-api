// Dependencies
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

// Resolvers

// Commands & Queries
import { ShowCommandHandlers, ShowQueriesHandlers } from '@/data/usecases'

// Providers
import { ShowPersistenceProviders } from '@/infra/db/mongodb'

// Schemas
import { Show, ShowSchema } from '@/domain/entities/show'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Show.name, schema: ShowSchema }])
  ],
  providers: [
    ...ShowCommandHandlers,
    ...ShowQueriesHandlers,
    ...ShowPersistenceProviders
  ],
  exports: [
    ...ShowPersistenceProviders
  ]
})
export class ShowModule {}
