// Dependencies
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

// Commands
import { DailyLiturgyCommand } from '@/data/protocols'

// Services
import { PythonWebscrapService } from '@/infra/webscrap'
// import { ChatGptService } from '@/infra/openai'

// Return interface
interface ScrapReturn {
  title: string
  content: string
}

@CommandHandler(DailyLiturgyCommand)
export class DailyLiturgyHandler implements ICommandHandler<DailyLiturgyCommand> {
  // Dependencies injection
  constructor(
    private readonly webscrapService: PythonWebscrapService
    // private readonly openaiService: ChatGptService
  ) {}

  // Execute action handler
  async execute(command: DailyLiturgyCommand): Promise<ScrapReturn[]> {
    // Destruct params
    const { params: { date } } = command

    // Format date to DD/MM/YYYY
    const formattedDateString = date.split('-').reverse().join('/')

    // Scrap daily liturgy
    const r = await this.webscrapService.scrapDailyLiturgy(formattedDateString)

    // Return scraped liturgy
    return r.data
  }
}
