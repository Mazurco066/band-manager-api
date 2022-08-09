// Dependencies
import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { baseResponse, IBaseResponse } from '@/domain/shared'

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
    return baseResponse(200, 'O convite foi respondido com sucesso!', response)
  }

  // Pending invites
  async pendingInvites(payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.queryBus.execute(new PendingInvitesQuery(payload))
    return baseResponse(200, 'Lista de convites pendentes foi recuperada!', response)
  }
}
