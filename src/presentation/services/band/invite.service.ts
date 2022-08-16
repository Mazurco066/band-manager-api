// Dependencies
import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { baseResponse, IBaseResponse, sanitizeJson } from '@/domain/shared'

// Inputs
import {
  RespondInviteInput
} from '@/domain/protocols'

// Commands and queries
import {
  PendingInvitesQuery,
  RespondInviteCommand,
  TokenPayload
} from '@/data/protocols'

// Default class omits
const inviteOmitKeys = [
  '_id',
  '__v',
  'band._id',
  'band.__v',
  'band.admins',
  'band.directory',
  'band.members',
  'account._id',
  'account.__v',
  'account.password'
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
export class InviteService {
  // Dependencies Injection
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  // Respond invite
  async respondInvite(params: RespondInviteInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new RespondInviteCommand(params, payload))
    const safeResponse = sanitizeJson(response, bandMutationOmitKeys)
    return baseResponse(200, 'O convite foi respondido com sucesso!', safeResponse)
  }

  // Pending invites
  async pendingInvites(payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.queryBus.execute(new PendingInvitesQuery(payload))
    const safeResponse = sanitizeJson(response, inviteOmitKeys)
    return baseResponse(200, 'Lista de convites pendentes foi recuperada!', safeResponse)
  }
}
