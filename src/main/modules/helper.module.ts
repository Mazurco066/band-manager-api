// Dependencies
import { Module } from '@nestjs/common'

// Commands & Queries
import {
  HelperCommandHandlers,
  HelperQueriesHandlers
} from '@/data/usecases'

// Services
import { PythonWebscrapService } from '@/infra/webscrap'
import { ChatGptService } from '@/infra/openai'
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
    ChatGptService,
    PythonWebscrapService,
    ...HelperServices,
    ...HelperCommandHandlers,
    ...HelperQueriesHandlers
  ]
})
export class HelperModule {}