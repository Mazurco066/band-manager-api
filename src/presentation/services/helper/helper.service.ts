// Dependencies
import { Injectable } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { baseResponse, IBaseResponse } from '@/domain/shared'

// Inputs
import {
  ScrapSongInput,
  DailyLiturgyInput
} from '@/domain/protocols'

// Commands and queries
import {
  DailyLiturgyCommand,
  ScrapSongCommand,
  TokenPayload
} from '@/data/protocols'

@Injectable()
export class HelperService {
  // Dependencies Injection
  constructor(
    private readonly commandBus: CommandBus
  ) {}

  // Scrap Song
  async scrapSong(params: ScrapSongInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new ScrapSongCommand(params, payload))
    return baseResponse(200, 'Uma música foi encontrada na busca.', response)
  }

  // Daily liturgy
  async dailyLiturgy(params: DailyLiturgyInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new DailyLiturgyCommand(params, payload))
    return baseResponse(200, 'Liturgia diária obtida.', response || [])
  }
}
