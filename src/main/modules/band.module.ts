// Dependencies
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

// Resolvers
import { BandControllers } from '@/presentation/controllers'

// Commands & Queries
import { BandCommandHandlers, BandQueriesHandlers } from '@/data/usecases'

// Providers
import { BandPersistenceProviders } from '@/infra/db/mongodb'

// Schemas
import { Band, BandSchema, Invite, InviteSchema } from '@/domain/entities/band'

// External modules
import { AccountModule } from './account.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Band.name, schema: BandSchema },
      { name: Invite.name, schema: InviteSchema }
    ]),
    AccountModule
  ],
  providers: [
    ...BandControllers,
    ...BandCommandHandlers,
    ...BandQueriesHandlers,
    ...BandPersistenceProviders
  ],
  exports: [
    ...BandPersistenceProviders
  ]
})
export class BandModule {}
