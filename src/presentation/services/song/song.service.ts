// Dependencies
import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { baseResponse, IBaseResponse } from '@/domain/shared'

// Inputs
import {
  AddSongInput,
  UpdateSongInput,
  ListSongsInput,
  ListPublicSongsInput
} from '@/domain/protocols'

// Commands and queries
import {
  AddSongCommand,
  RemoveSongCommand,
  UpdateSongCommand,
  LoadSongQuery,
  ListSongsQuery,
  ListPublicSongsQuery,
  TokenPayload
} from '@/data/protocols'

@Injectable()
export class SongService {
  // Dependencies Injection
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  // Load song by id
  async loadSongById(id: string, bandId: string, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.queryBus.execute(new LoadSongQuery(id, bandId, payload))
    return baseResponse(200, 'Música recuperada com sucesso!', response)
  }

  // List songs
  async listSongs(bandId: string, params: ListSongsInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.queryBus.execute(new ListSongsQuery(bandId, params, payload))
    return baseResponse(200, 'Músicas recuperadas com sucesso!', response)
  }

  // List public songs
  async listPublicSongs(params: ListPublicSongsInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.queryBus.execute(new ListPublicSongsQuery(params, payload))
    return baseResponse(200, 'Músicas recuperadas com sucesso!', response)
  }

  // Add song
  async addSong(bandId: string, params: AddSongInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new AddSongCommand(bandId, params, payload))
    return baseResponse(201, 'Música salva com sucesso!', response)
  }

  // Update song
  async updateSong(id: string, params: UpdateSongInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new UpdateSongCommand(id, params, payload))
    return baseResponse(200, 'Música atualizada com sucesso!', response)
  }

  // Remove song
  async removeSong(id: string, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new RemoveSongCommand(id, payload))
    return baseResponse(200, 'Música removida com sucesso!', response)
  }
}
