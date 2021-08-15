// Dependencies
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

// Resolvers
import { AccountResolvers } from '@/presentation/resolvers'

// Commands & Queries
import { AccountCommandHandlers, AccountQueriesHandlers } from '@/data/usecases'

// Providers
import { AccountPersistenceProviders } from '@/infra/db/mongodb'

// Schemas
import { Account, AccountSchema } from '@/domain/entities/account'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }])
  ],
  providers: [
    ...AccountResolvers,
    ...AccountCommandHandlers,
    ...AccountQueriesHandlers,
    ...AccountPersistenceProviders
  ],
  exports: [
    ...AccountPersistenceProviders
  ]
})
export class AccountModule {}
