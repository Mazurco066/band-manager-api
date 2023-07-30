// Dependencies
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

// Commands
import { DailyLiturgyCommand } from '@/data/protocols'

// Services
import { WebscrapService } from '@/infra/webscrap'
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
    private readonly webscrapService: WebscrapService
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

    // Format retrieved texts
    // const promises = await Promise.all(r.data.map(({ content }) => this.openaiService.formatText(content)))
    // console.log("[FORMATTED TEXTS]", promises)
    // const formatedText = await this.openaiService.formatText(r.data[1].content)
    // console.log("[FORMATTED TEXTS]", formatedText)

    // Return scraped liturgy
    return r.data
  }
}
