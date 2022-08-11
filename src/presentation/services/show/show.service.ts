// Dependencies
import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { baseResponse, IBaseResponse } from '@/domain/shared'

// Inputs
import {
  AddObservationInput,
  AddShowInput,
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

@Injectable()
export class ShowService {
  // Dependencies Injection
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  // Load show by id
  async loadShowById(id: string, bandId: string, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.queryBus.execute(new LoadShowQuery(id, bandId, payload))
    return baseResponse(200, 'Show recuperado com sucesso!', response)
  }

  // Load account shows
  async loadAccountShows(payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.queryBus.execute(new ListShowsByAccountQuery(payload))
    return baseResponse(200, 'Shows recuperados com sucesso!', response)
  }

  // Load pending shows
  async loadPendingShows(payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.queryBus.execute(new LoadPendingShowsQuery(payload))
    return baseResponse(200, 'Shows recuperados com sucesso!', response)
  }

  // List shows
  async listShows(bandId: string, params: ListShowsInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.queryBus.execute(new ListShowsQuery(bandId, params, payload))
    return baseResponse(200, 'Shows recuperados com sucesso!', response)
  }

  // Add show
  async addShow(params: AddShowInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new AddShowCommand(params, payload))
    return baseResponse(201, 'Show salvo com sucesso!', response)
  }

  // Add show observation
  async addShowObservation(showId: string, params: AddObservationInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new AddObservationCommand(showId, params, payload))
    return baseResponse(201, 'Observação salva com sucesso!', response)
  }

  // Update show observation
  async updateShowObservation(id: string, showId: string, params: UpdateObservationInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new UpdateObservationCommand(id, showId, params, payload))
    return baseResponse(200, 'Observação atualizada com sucesso!', response)
  }

  // Remove show observation
  async removeShowObservation(showId: string, observationId: string, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new RemoveObservationCommand(showId, observationId, payload))
    return baseResponse(200, 'Observação removida com sucesso!', response)
  }

  // Update show
  async updateShow(id: string, params: UpdateShowInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new UpdateShowCommand(id, params, payload))
    return baseResponse(200, 'Show atualizado com sucesso!', response)
  }

  // Reorder show
  async reorderShow(id: string, params: ReorderShowInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new ReorderShowCommand(id, params, payload))
    return baseResponse(200, 'Show reordenado com sucesso!', response)
  }

  // Remove show
  async removeShow(id: string, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new RemoveShowCommand(id, payload))
    return baseResponse(200, 'Show removido com sucesso!', response)
  }

  // Unlink song
  async unlinkSong(id: string, params: UnlinkSongInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new UnlinkSongCommand(id, params, payload))
    return baseResponse(200, 'Música foi desvinculada do show!', response)
  }

  // Link song
  async linkSong(id: string, params: LinkSongInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new LinkSongCommand(id, params, payload))
    return baseResponse(200, 'Música foi vinculada ao show!', response)
  }
}
