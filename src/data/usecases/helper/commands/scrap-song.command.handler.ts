// Dependencies
import { HttpException, HttpStatus } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

// Commands
import { ScrapSongCommand } from '@/data/protocols'

// Services
import { PythonWebscrapService } from '@/infra/webscrap'

// Return interface
interface ScrapReturn {
  loot: string
  title: string
  writter: string
  tone: string
}

@CommandHandler(ScrapSongCommand)
export class ScrapSongHandler implements ICommandHandler<ScrapSongCommand> {
  // Dependencies injection
  constructor(
    private readonly webscrapService: PythonWebscrapService
  ) {}

  // Execute action handler
  async execute(command: ScrapSongCommand): Promise<ScrapReturn> {
    // Destruct params
    const { params: { url } } = command

    // Validate url
    if (url.includes('cifraclub.com.br')) {

      // Retrieve song from cifra club
      const r = await this.webscrapService.scrapCifraClubSong(url)
      if (r.status.code !== 200) throw new HttpException(
        r.status.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      )
      return {
        loot: r.data?.loot || '',
        tone: r.data?.tone || '',
        writter: r.data?.writter || '',
        title: r.data?.title || ''
      }

    } else if (url.includes('cifras.com.br')) {

      // Retrieve song from cifras
      const r = await this.webscrapService.scrapCifrasSong(url)
      if (r.status.code !== 200) throw new HttpException(
        r.status.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      )
      return {
        loot: r.data?.loot || '',
        tone: r.data?.tone || '',
        writter: r.data?.writter || '',
        title: r.data?.title || ''
      }

    } else {
      throw new HttpException('Invalid URL', HttpStatus.BAD_REQUEST)
    }    
  }
}
