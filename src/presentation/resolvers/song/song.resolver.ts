// Dependencies
import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

// Types
import {
  AddSongInput,
  RemoveSongByIdInput,
  UpdateSongInput,
  BaseSongType
} from '@/domain/protocols'

// Commands & Queries
import {
  AddSongCommand,
  RemoveSongCommand,
  UpdateSongCommand,
  TokenPayload
} from '@/data/protocols'

// Authenticator
import { Roles, Role, GqlUserDecorator } from '@/main/decorators' 

// Schemas
import { Song } from '@/domain/entities'

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
  ): Promise<Song> {
    return this.commandBus.execute(new AddSongCommand({ ...params }, payload))
  }

  /**
   * Remove Song Resolver
   * @param params - Check RemoveSongByIdInput for details
   */
  @Mutation(() => BaseSongType)
  @Roles(Role.player, Role.master)
  async removeSong(
    @Args(RemoveSongByIdInput.name) params: RemoveSongByIdInput,
    @GqlUserDecorator() payload: TokenPayload
  ): Promise<Song> {
    return this.commandBus.execute(new RemoveSongCommand({ ...params }, payload))
  }

  /**
   * Update Song Resolver
   * @param params - Check UpdateSongInput for details
   */
  @Mutation(() => BaseSongType)
  @Roles(Role.player, Role.master)
  async updateSong(
    @Args(UpdateSongInput.name) params: UpdateSongInput,
    @GqlUserDecorator() payload: TokenPayload
  ): Promise<Song> {
    return this.commandBus.execute(new UpdateSongCommand({ ...params }, payload))
  }
}
