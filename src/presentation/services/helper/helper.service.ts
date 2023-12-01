// Dependencies
import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { baseResponse, IBaseResponse } from '@/domain/shared'

// Inputs
import {
  ScrapSongInput,
  DailyLiturgyInput
} from '@/domain/protocols'

// Commands and queries
import {
  DailyLiturgyCommand,
  GetLiturgyColorQuery,
  IsServiceAvailableQuery,
  ScrapSongCommand,
  TokenPayload,
  UploadFileCommand
} from '@/data/protocols'

@Injectable()
export class HelperService {
  // Dependencies Injection
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  // Scrap Song
  async scrapSong(params: ScrapSongInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new ScrapSongCommand(params, payload))
    return baseResponse(200, 'Uma música foi encontrada na busca.', response)
  }

  // Upload image
  async uploadFile(file: Express.Multer.File, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new UploadFileCommand(file, payload))
    return baseResponse(200, 'Image successfully uploaded', response)
  }

  // Daily liturgy
  async dailyLiturgy(params: DailyLiturgyInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new DailyLiturgyCommand(params, payload))
    return baseResponse(200, 'Liturgia diária obtida.', response || [])
  }

  // Liturgy color
  async liturgyColor(id: string, payload: TokenPayload): Promise<IBaseResponse> {
    const reponse = await this.queryBus.execute(new GetLiturgyColorQuery(id, payload))
    return baseResponse(200, 'Cor da liturgia obtida', reponse)
  }

  // Service status
  async isServiceAvailable(): Promise<IBaseResponse> {
    const response = await this.queryBus.execute(new IsServiceAvailableQuery())
    return baseResponse(200, 'Service status response', response || { status: 'offline' })
  }
}
