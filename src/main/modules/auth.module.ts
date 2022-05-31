// Dependencies
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

// Resolvers
import { AuthResolvers } from '@/presentation/resolvers'

// Commands & Queries
import { AuthCommandHandlers, AuthQueriesHandlers } from '@/data/usecases'

// Providers
import { AuthPersistenceProviders } from '@/infra/db/mongodb'

// Schemas
import { Auth, AuthSchema } from '@/domain/entities/auth'

// Strategies
import { StrageriesResolvers } from '@/main/strategies'

// Module Providers
import { AccountModule } from './account.module'

// Infra services
import { SendGridService } from  '@/infra/mail'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
    AccountModule
  ],
  providers: [
    ...StrageriesResolvers,
    ...AuthResolvers,
    ...AuthCommandHandlers,
    ...AuthQueriesHandlers,
    ...AuthPersistenceProviders,
    SendGridService
  ],
  exports: [
    ...AuthPersistenceProviders
  ]
})
export class AuthModule {}
