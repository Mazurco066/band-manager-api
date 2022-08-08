// Dependencies
import { Module } from '@nestjs/common'

// Commands & Queries
import { HelperCommandHandlers } from '@/data/usecases'

// Services
import { WebscrapService } from '@/infra/webscrap'

// Resolvers
import { HelperControllers } from '@/presentation/controllers'

// Helper module
@Module({
  imports: [],
  controllers: [
    ...HelperControllers
  ],
  providers: [
    WebscrapService,
    ...HelperCommandHandlers
  ]
})
export class HelperModule {}