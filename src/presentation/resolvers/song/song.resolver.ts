// Dependencies
import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

// Types
import {
  AddSongInput,
  RemoveSongByIdInput,
  UpdateSongInput,
  LoadSongByIdInput,
  ListSongsInput,
  ListPublicSongsInput,
  BaseSongType,
  SongType
} from '@/domain/protocols'

// Commands & Queries
import {
  AddSongCommand,
  RemoveSongCommand,
  UpdateSongCommand,
  LoadSongQuery,
  ListSongsQuery,
  ListPublicSongsQuery,
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

  /**
   * Loads a song from a band
   * @param params - Check LoadSongByIdInput for details
   */
  @Query(() => SongType)
  @Roles(Role.player, Role.master)
  async song(
    @Args(LoadSongByIdInput.name) params: LoadSongByIdInput,
    @GqlUserDecorator() payload: TokenPayload
  ): Promise<SongType> {
    return this.queryBus.execute(new LoadSongQuery({ ...params }, payload))
  }

  /**
   * Loads songs from a band
   * @param params - Check ListSongsInput for details
   */
  @Query(() => [SongType])
  @Roles(Role.player, Role.master)
  async songs(
    @Args(ListSongsInput.name) params: ListSongsInput,
    @GqlUserDecorator() payload: TokenPayload
  ): Promise<Song[]> {
    return this.queryBus.execute(new ListSongsQuery({ ...params }, payload))
  }

  /**
   * Loads songs from a band
   * @param params - Check ListPublicSongsInput for details
   */
   @Query(() => [SongType])
   async publicSongs(
     @Args(ListPublicSongsInput.name) params: ListPublicSongsInput,
     @GqlUserDecorator() payload: TokenPayload
   ): Promise<Song[]> {
     return this.queryBus.execute(new ListPublicSongsQuery({ ...params }, payload))
   }
}
