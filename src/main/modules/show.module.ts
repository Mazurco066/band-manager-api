// Dependencies
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

// Controllers and services
import { ShowControllers } from '@/presentation/controllers'
import { ShowServices } from '@/presentation/services'

// Commands & Queries
import { ShowCommandHandlers, ShowQueriesHandlers } from '@/data/usecases'

// Providers
import { ShowPersistenceProviders } from '@/infra/db/mongodb'

// Schemas
import { Show, ShowSchema } from '@/domain/entities/show'

// External modules
import { AccountModule } from './account.module'
import { BandModule } from './band.module'
import { SongModule } from './song.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Show.name, schema: ShowSchema }]),
    AccountModule,
    BandModule,
    SongModule
  ],
  controllers: [
    ...ShowControllers
  ],
  providers: [
    ...ShowServices,
    ...ShowCommandHandlers,
    ...ShowQueriesHandlers,
    ...ShowPersistenceProviders
  ],
  exports: [
    ...ShowPersistenceProviders
  ]
})
export class ShowModule {}
