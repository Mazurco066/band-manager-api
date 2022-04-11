// Dependencies
import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

// Types
import { InviteType, BaseBandType, RespondInviteInput } from '@/domain/protocols'

// Commands & Queries
import { TokenPayload, PendingInvitesQuery, RespondInviteCommand } from '@/data/protocols'

// Authenticator
import { Roles, Role, GqlUserDecorator } from '@/main/decorators' 

// Schemas
import { Invite, Band } from '@/domain/entities'

@Resolver('Invites')
@Injectable()
export class InviteResolver {
  // Dependencies Injection
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  /**
   * Respond band invite Resolver
   * @param params - Check RespondInviteInput for details
   */
   @Mutation(() => BaseBandType)
   @Roles(Role.player, Role.master)
   async respondInvite(
     @Args(RespondInviteInput.name) params: RespondInviteInput,
     @GqlUserDecorator() payload: TokenPayload
   ): Promise<Band> {
     return this.commandBus.execute(new RespondInviteCommand({ ...params }, payload))
   }

  /**
   * List pending invites
   */
   @Query(() => [InviteType])
   @Roles(Role.player, Role.master)
   async pendingInvites(
     @GqlUserDecorator() payload: TokenPayload
   ): Promise<Invite[]> {
     return this.queryBus.execute(new PendingInvitesQuery(payload))
   }
}
