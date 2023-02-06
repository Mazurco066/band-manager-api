// Dependencies
import { Module } from '@nestjs/common'

// Commands & Queries
import {
  HelperCommandHandlers,
  HelperQueriesHandlers
} from '@/data/usecases'

// Services
import { WebscrapService } from '@/infra/webscrap'
import { HelperServices } from "@/presentation/services"

// Controllers
import { HelperControllers } from '@/presentation/controllers'

// Helper module
@Module({
  imports: [],
  controllers: [
    ...HelperControllers
  ],
  providers: [
    WebscrapService,
    ...HelperServices,
    ...HelperCommandHandlers,
    ...HelperQueriesHandlers
  ]
})
export class HelperModule {}