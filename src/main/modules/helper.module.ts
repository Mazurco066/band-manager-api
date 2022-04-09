// Dependencies
import { Module } from '@nestjs/common'

// Commands & Queries
import { HelperCommandHandlers } from '@/data/usecases'

// Services
import { WebscrapService } from '@/infra/webscrap'

// Resolvers
import { HelperResolvers } from '@/presentation/resolvers'

// Helper module
@Module({
  imports: [],
  providers: [
    WebscrapService,
    ...HelperCommandHandlers,
    ...HelperResolvers
  ]
})
export class HelperModule {}