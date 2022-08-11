// Dependencies
import { Injectable, Controller, Body, Post, Get } from '@nestjs/common'
import { InviteService } from '../../services/band'
import { IBaseResponse } from '@/domain/shared'

// Authorization
import { Roles, Role, JwtUserDecorator } from '@/main/decorators'
import { TokenPayload } from '@/data/protocols'

// Inputs
import {
  RespondInviteInput
} from '@/domain/protocols'

@Controller('api/v1/invitations')
@Injectable()
export class InviteController {
  // Dependencies Injection
  constructor(
    private readonly inviteService: InviteService
  ) {}

  @Post('/respond')
  @Roles(Role.player, Role.master)
  async respondInvite(
    @Body() params: RespondInviteInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.inviteService.respondInvite(params, payload)
  }

  @Get('/pending_invites')
  @Roles(Role.player, Role.master)
  async pendingInvites(
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.inviteService.pendingInvites(payload)
  }
}
