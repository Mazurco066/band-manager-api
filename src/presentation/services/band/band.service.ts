// Dependencies
import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { baseResponse, IBaseResponse, sanitizeJson } from '@/domain/shared'

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
  TransferOwnershipCommand,
  TokenPayload
} from '@/data/protocols'

// Default class omits
const bandOmitKeys = [
  '_id',
  '__v',
  'owner._id',
  'owner.__v',
  'owner.password',
  'members._id',
  'members.__v',
  'members.password',
  'admins._id',
  'admins.__v',
  'admins.password',
  'directory'
]

const bandMutationOmitKeys = [
  '_id',
  '__v',
  'owner',
  'members',
  'admins',
  'directory'
]

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
    const safeResponse = sanitizeJson(response, bandOmitKeys)
    return baseResponse(200, 'Banda recuperada com sucesso!', safeResponse)
  }

  // List bands
  async listBands(params: ListBandsInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.queryBus.execute(new ListBandsQuery(params, payload))
    const safeResponse = sanitizeJson(response, bandOmitKeys)
    return baseResponse(200, 'Bandas recuperadas com sucesso!', safeResponse)
  }

  // Add band
  async addBand(params: AddBandInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new AddBandCommand(params, payload))
    const safeResponse = sanitizeJson(response, bandMutationOmitKeys)
    return baseResponse(201, 'Banda adicionada com sucesso!', safeResponse)
  }

  // Update band
  async updateBand(id: string, params: UpdateBandInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new UpdateBandCommand(id, params, payload))
    const safeResponse = sanitizeJson(response, bandMutationOmitKeys)
    return baseResponse(200, 'Banda atualizada com sucesso!', safeResponse)
  }

  // Remove band
  async removeBand(id: string, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new RemoveBandCommand(id, payload))
    const safeResponse = sanitizeJson(response, bandMutationOmitKeys)
    return baseResponse(200, 'Banda removida com sucesso!', safeResponse)
  }

  // Add member
  async addBandMember(id: string, params: AddMemberInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new AddMemberCommand(id, params, payload))
    const safeResponse = sanitizeJson(response, bandMutationOmitKeys)
    return baseResponse(200, 'O Membro foi convidado a se juntar a Banda!', safeResponse)
  }

  // Promite member
  async promoteBandMember(id: string, params: PromoteMemberInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new PromoteMemberCommand(id, params, payload))
    const safeResponse = sanitizeJson(response, bandMutationOmitKeys)
    return baseResponse(200, 'O Membro foi promovido com sucesso!', safeResponse)
  }

  // Demote member
  async demoteBandMember(id: string, params: DemoteMemberInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new DemoteMemberCommand(id, params, payload))
    const safeResponse = sanitizeJson(response, bandMutationOmitKeys)
    return baseResponse(200, 'O Membro foi rebaixado com sucesso!', safeResponse)
  }

  // Remove member
  async removeBandMember(id: string, params: RemoveMemberInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new RemoveMemberCommand(id, params, payload))
    const safeResponse = sanitizeJson(response, bandMutationOmitKeys)
    return baseResponse(200, 'O Membro foi removido com sucesso!', safeResponse)
  }

  // Transfer ownership
  async transferOwnership(id: string, params: PromoteMemberInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new TransferOwnershipCommand(id, params, payload))
    const safeResponse = sanitizeJson(response, bandMutationOmitKeys)
    return baseResponse(200, 'O Membro foi promovido a lider com sucesso!', safeResponse)
  }
}
