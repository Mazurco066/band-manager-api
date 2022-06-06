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
import { Account, AccountSchema, VerificationCode, VerificationCodeSchema } from '@/domain/entities/account'

// Infrastructure services
import { SendGridService } from '@/infra/mail'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
      { name: VerificationCode.name, schema: VerificationCodeSchema }
    ])
  ],
  providers: [
    ...AccountResolvers,
    ...AccountCommandHandlers,
    ...AccountQueriesHandlers,
    ...AccountPersistenceProviders,
    SendGridService
  ],
  exports: [
    ...AccountPersistenceProviders
  ]
})
export class AccountModule {}
