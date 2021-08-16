// Dependencies
import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

// Types
import {
  AddBandInput,
  BandType,
  BaseBandType,
  LoadBandByIdInput
} from '@/domain/protocols'

// Commands & Queries
import {
  AddBandCommand,
  TokenPayload,
  LoadBandByIdQuery
} from '@/data/protocols'

// Authenticator
import { Roles, Role, GqlUserDecorator } from '@/main/decorators' 

// Schemas
import { Account } from '@/domain/entities'

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
  ): Promise<Account> {
    return this.commandBus.execute(new AddBandCommand({ ...params }, payload))
  }
}
