// Dependencies
import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { baseResponse, IBaseResponse, sanitizeJson } from '@/domain/shared'

// Inputs
import {
  AddObservationInput,
  AddShowInput,
  CloneConcertInput,
  LinkSongInput,
  ListShowsInput,
  ReorderShowInput,
  UnlinkSongInput,
  UpdateObservationInput,
  UpdateShowInput
} from '@/domain/protocols'

// Commands and queries
import {
  AddObservationCommand,
  AddShowCommand,
  CloneConcertCommand,
  LinkSongCommand,
  ListShowsQuery,
  ListShowsByAccountQuery,
  LoadShowQuery,
  RemoveObservationCommand,
  RemoveShowCommand,
  ReorderShowCommand,
  UnlinkSongCommand,
  UpdateObservationCommand,
  UpdateShowCommand,
  LoadPendingShowsQuery,
  TokenPayload
} from '@/data/protocols'

// Default class omits
const showOmitKeys = [
  '_id',
  '__v',
  'band._id',
  'band.__v',
  'band.admins',
  'band.directory',
  'band.members',
  'songs._id',
  'songs.__v',
  'songs.band',
  'songs.category'
]

const showMutationOmitKeys = [
  '_id',
  '__v',
  'band',
  'songs'
]

@Injectable()
export class ShowService {
  // Dependencies Injection
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  // Load show by id
  async loadShowById(id: string, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.queryBus.execute(new LoadShowQuery(id, payload))
    const safeResponse = sanitizeJson(response, showOmitKeys)
    return baseResponse(200, 'Show recuperado com sucesso!', safeResponse)
  }

  // Load account shows
  async loadAccountShows(payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.queryBus.execute(new ListShowsByAccountQuery(payload))
    const safeResponse = sanitizeJson(response, showOmitKeys)
    return baseResponse(200, 'Shows recuperados com sucesso!', safeResponse)
  }

  // Load pending shows
  async loadPendingShows(payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.queryBus.execute(new LoadPendingShowsQuery(payload))
    const safeResponse = sanitizeJson(response, showOmitKeys)
    return baseResponse(200, 'Shows recuperados com sucesso!', safeResponse)
  }

  // List shows
  async listShows(bandId: string, params: ListShowsInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.queryBus.execute(new ListShowsQuery(bandId, params, payload))
    const safeResponse = sanitizeJson(response.data, showOmitKeys)
    return baseResponse(200, 'Shows recuperados com sucesso!', safeResponse)
  }

  // List shows (v2)
  async listShowsV2(bandId: string, params: ListShowsInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.queryBus.execute(new ListShowsQuery(bandId, params, payload))
    const safeResponse = {
      limit: response.limit,
      offset: response.offset,
      total: response.total,
      data: sanitizeJson(response.data, showOmitKeys)
    }
    return baseResponse(200, 'Shows recuperados com sucesso!', safeResponse)
  }

  // Add show
  async addShow(params: AddShowInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new AddShowCommand(params, payload))
    const safeResponse = sanitizeJson(response, showMutationOmitKeys)
    return baseResponse(201, 'Show salvo com sucesso!', safeResponse)
  }

  // Clone show
  async cloneConcert(id: string, params: CloneConcertInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new CloneConcertCommand(id, params, payload))
    const safeResponse = sanitizeJson(response, showMutationOmitKeys)
    return baseResponse(200, 'Apresentação duplicada com sucesso!', safeResponse)
  }

  // Add show observation
  async addShowObservation(showId: string, params: AddObservationInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new AddObservationCommand(showId, params, payload))
    const safeResponse = sanitizeJson(response, showMutationOmitKeys)
    return baseResponse(201, 'Observação salva com sucesso!', safeResponse)
  }

  // Update show observation
  async updateShowObservation(id: string, showId: string, params: UpdateObservationInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new UpdateObservationCommand(id, showId, params, payload))
    const safeResponse = sanitizeJson(response, showMutationOmitKeys)
    return baseResponse(200, 'Observação atualizada com sucesso!', safeResponse)
  }

  // Remove show observation
  async removeShowObservation(showId: string, observationId: string, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new RemoveObservationCommand(showId, observationId, payload))
    const safeResponse = sanitizeJson(response, showMutationOmitKeys)
    return baseResponse(200, 'Observação removida com sucesso!', safeResponse)
  }

  // Update show
  async updateShow(id: string, params: UpdateShowInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new UpdateShowCommand(id, params, payload))
    const safeResponse = sanitizeJson(response, showMutationOmitKeys)
    return baseResponse(200, 'Show atualizado com sucesso!', safeResponse)
  }

  // Reorder show
  async reorderShow(id: string, params: ReorderShowInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new ReorderShowCommand(id, params, payload))
    const safeResponse = sanitizeJson(response, showMutationOmitKeys)
    return baseResponse(200, 'Show reordenado com sucesso!', safeResponse)
  }

  // Remove show
  async removeShow(id: string, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new RemoveShowCommand(id, payload))
    const safeResponse = sanitizeJson(response, showMutationOmitKeys)
    return baseResponse(200, 'Show removido com sucesso!', safeResponse)
  }

  // Unlink song
  async unlinkSong(id: string, params: UnlinkSongInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new UnlinkSongCommand(id, params, payload))
    const safeResponse = sanitizeJson(response, showMutationOmitKeys)
    return baseResponse(200, 'Música foi desvinculada do show!', safeResponse)
  }

  // Link song
  async linkSong(id: string, params: LinkSongInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new LinkSongCommand(id, params, payload))
    const safeResponse = sanitizeJson(response, showMutationOmitKeys)
    return baseResponse(200, 'Música foi vinculada ao show!', safeResponse)
  }
}
