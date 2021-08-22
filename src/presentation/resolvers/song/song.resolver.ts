// Dependencies
import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

// Types
import {
  AddSongInput,
  BaseSongType
} from '@/domain/protocols'

// Commands & Queries
import {
  AddSongCommand,
  TokenPayload
} from '@/data/protocols'

// Authenticator
import { Roles, Role, GqlUserDecorator } from '@/main/decorators' 

// Schemas
import { Band } from '@/domain/entities'

@Resolver('Songs')
@Injectable()
export class SongResolver {
  // Dependencies Injection
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  /**
   * Create Song Resolver
   * @param params - Check AddSongInput for details
   */
  @Mutation(() => BaseSongType)
  @Roles(Role.player, Role.master)
  async addSong(
    @Args(AddSongInput.name) params: AddSongInput,
    @GqlUserDecorator() payload: TokenPayload
  ): Promise<Band> {
    return this.commandBus.execute(new AddSongCommand({ ...params }, payload))
  }
}
