// Dependencies
import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

// Types
import {
  AddBandInput,
  AddMemberInput,
  PromoteMemberInput,
  RemoveMemberInput,
  BandType,
  BaseBandType,
  LoadBandByIdInput
} from '@/domain/protocols'

// Commands & Queries
import {
  AddBandCommand,
  AddMemberCommand,
  PromoteMemberCommand,
  RemoveMemberCommand,
  TokenPayload,
  LoadBandByIdQuery
} from '@/data/protocols'

// Authenticator
import { Roles, Role, GqlUserDecorator } from '@/main/decorators' 

// Schemas
import { Band } from '@/domain/entities'

@Resolver('Bands')
@Injectable()
export class BandResolver {
  // Dependencies Injection
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  /**
   * Loads band by id
   * @param params - Check LoadBandByIdInput for details
   */
  @Query(() => BandType)
  @Roles(Role.player, Role.master)
  async band(
    @Args(LoadBandByIdInput.name) params: LoadBandByIdInput,
    @GqlUserDecorator() payload: TokenPayload
  ): Promise<BandType> {
    return this.queryBus.execute(new LoadBandByIdQuery({ ...params }, payload))
  }

  /**
   * Create Band Resolver
   * @param params - Check AddBandInput for details
   */
  @Mutation(() => BaseBandType)
  @Roles(Role.player, Role.master)
  async addBand(
    @Args(AddBandInput.name) params: AddBandInput,
    @GqlUserDecorator() payload: TokenPayload
  ): Promise<Band> {
    return this.commandBus.execute(new AddBandCommand({ ...params }, payload))
  }

  /**
   * Add Band Member Resolver
   * @param params - Check AddMemberInput for details
   */
  @Mutation(() => BaseBandType)
  @Roles(Role.player, Role.master)
  async addBandMember(
    @Args(AddMemberInput.name) params: AddMemberInput,
    @GqlUserDecorator() payload: TokenPayload
  ): Promise<Band> {
    return this.commandBus.execute(new AddMemberCommand({ ...params }, payload))
  }

  /**
   * Promote Band Member Resolver
   * @param params - Check PromoteMemberInput for details
   */
  @Mutation(() => BaseBandType)
  @Roles(Role.player, Role.master)
  async promoteBandMember(
    @Args(PromoteMemberInput.name) params: PromoteMemberInput,
    @GqlUserDecorator() payload: TokenPayload
  ): Promise<Band> {
    return this.commandBus.execute(new PromoteMemberCommand({ ...params }, payload))
  }

  /**
   * Remove Band Member Resolver
   * @param params - Check RemoveMemberInput for details
   */
  @Mutation(() => BaseBandType)
  @Roles(Role.player, Role.master)
  async removeBandMember(
    @Args(RemoveMemberInput.name) params: RemoveMemberInput,
    @GqlUserDecorator() payload: TokenPayload
  ): Promise<Band> {
    return this.commandBus.execute(new RemoveMemberCommand({ ...params }, payload))
  }
}
