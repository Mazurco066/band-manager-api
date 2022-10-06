// Dependencies
import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { baseResponse, IBaseResponse, sanitizeJson } from '@/domain/shared'

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

// Default class omits
const songOmitKeys = [
  '_id',
  '__v',
  'band._id',
  'band.__v',
  'band.admins',
  'band.directory',
  'band.members',
  'category._id',
  'category.__v',
  'category.band'
]

const songMutationOmitKeys = [
  '_id',
  '__v',
  'band',
  'category'
]

@Injectable()
export class SongService {
  // Dependencies Injection
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  // Load song by id
  async loadSongById(id: string, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.queryBus.execute(new LoadSongQuery(id, payload))
    const safeResponse = sanitizeJson(response, songOmitKeys)
    return baseResponse(200, 'Música recuperada com sucesso!', safeResponse)
  }

  // List songs
  async listSongs(bandId: string, params: ListSongsInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.queryBus.execute(new ListSongsQuery(bandId, params, payload))
    const safeResponse = {
      total: response.total,
      data: sanitizeJson(response.data, songOmitKeys)
    }
    return baseResponse(200, 'Músicas recuperadas com sucesso!', safeResponse)
  }

  // List public songs
  async listPublicSongs(params: ListPublicSongsInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.queryBus.execute(new ListPublicSongsQuery(params, payload))
    const safeResponse = {
      total: response.total,
      data: sanitizeJson(response.data, songOmitKeys)
    }
    return baseResponse(200, 'Músicas recuperadas com sucesso!', safeResponse)
  }

  // Add song
  async addSong(bandId: string, params: AddSongInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new AddSongCommand(bandId, params, payload))
    const safeResponse = sanitizeJson(response, songMutationOmitKeys)
    return baseResponse(201, 'Música salva com sucesso!', safeResponse)
  }

  // Update song
  async updateSong(id: string, params: UpdateSongInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new UpdateSongCommand(id, params, payload))
    const safeResponse = sanitizeJson(response, songMutationOmitKeys)
    return baseResponse(200, 'Música atualizada com sucesso!', safeResponse)
  }

  // Remove song
  async removeSong(id: string, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new RemoveSongCommand(id, payload))
    const safeResponse = sanitizeJson(response, songMutationOmitKeys)
    return baseResponse(200, 'Música removida com sucesso!', safeResponse)
  }
}
