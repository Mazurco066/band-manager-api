// Dependencies
import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { baseResponse, IBaseResponse } from '@/domain/shared'

// Inputs
import {
  AddBandInput,
  AddMemberInput,
  PromoteMemberInput,
  RemoveMemberInput,
  DemoteMemberInput,
  UpdateBandInput,
  ListBandsInput
} from '@/domain/protocols'

// Commands and queries
import {
  AddBandCommand,
  AddMemberCommand,
  PromoteMemberCommand,
  RemoveMemberCommand,
  DemoteMemberCommand,
  RemoveBandCommand,
  UpdateBandCommand,
  ListBandsQuery,
  LoadBandByIdQuery,
  TokenPayload
} from '@/data/protocols'

@Injectable()
export class BandService {
  // Dependencies Injection
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  // Load band by id
  async loadBandById(id: string, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.queryBus.execute(new LoadBandByIdQuery(id, payload))
    return baseResponse(200, 'Banda recuperada com sucesso!', response)
  }

  // List bands
  async listBands(params: ListBandsInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.queryBus.execute(new ListBandsQuery(params, payload))
    return baseResponse(200, 'Bandas recuperadas com sucesso!', response)
  }

  // Add band
  async addBand(params: AddBandInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new AddBandCommand(params, payload))
    return baseResponse(201, 'Banda adicionada com sucesso!', response)
  }

  // Update band
  async updateBand(id: string, params: UpdateBandInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new UpdateBandCommand(id, params, payload))
    return baseResponse(200, 'Banda atualizada com sucesso!', response)
  }

  // Remove band
  async removeBand(id: string, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new RemoveBandCommand(id, payload))
    return baseResponse(200, 'Banda removida com sucesso!', response)
  }

  // Add member
  async addBandMember(id: string, params: AddMemberInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new AddMemberCommand(id, params, payload))
    return baseResponse(200, 'O Membro foi convidado a se juntar a Banda!', response)
  }

  // Promite member
  async promoteBandMember(id: string, params: PromoteMemberInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new PromoteMemberCommand(id, params, payload))
    return baseResponse(200, 'O Membro foi promovido com sucesso!', response)
  }

  // Demote member
  async demoteBandMember(id: string, params: DemoteMemberInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new DemoteMemberCommand(id, params, payload))
    return baseResponse(200, 'O Membro foi rebaixado com sucesso!', response)
  }

  // Remove member
  async removeBandMember(id: string, params: RemoveMemberInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new RemoveMemberCommand(id, params, payload))
    return baseResponse(200, 'O Membro foi removido com sucesso!', response)
  }
}
