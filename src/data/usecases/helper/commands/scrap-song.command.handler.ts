// Dependencies
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ApolloError } from 'apollo-server-express'

// Commands
import { ScrapSongCommand } from '@/data/protocols'

// Services
import { WebscrapService } from '@/infra/webscrap'

// Return interface
interface ScrapReturn { loot: string }

@CommandHandler(ScrapSongCommand)
export class ScrapSongHandler implements ICommandHandler<ScrapSongCommand> {
  // Dependencies injection
  constructor(
    private readonly webscrapService: WebscrapService
  ) {}

  // Execute action handler
  async execute(command: ScrapSongCommand): Promise<ScrapReturn> {
    // Destruct params
    const { params: { url } } = command

    // Validate url
    if (url.includes('cifraclub.com.br')) {

      // Retrieve song from cifra club
      const r = await this.webscrapService.scrapCifraClubSong(url)
      if (r.status.code !== 200) throw new ApolloError(r.status.message, `${r.status.code}`)
      return { loot: r.data?.text || '' }

    } else if (url.includes('cifras.com.br')) {

      // Retrieve song from cifras
      const r = await this.webscrapService.scrapCifrasSong(url)
      if (r.status.code !== 200) throw new ApolloError(r.status.message, `${r.status.code}`)
      return { loot: r.data?.text || '' }

    } else {
      throw new ApolloError('Invalid URL', '400')
    }    
  }
}
