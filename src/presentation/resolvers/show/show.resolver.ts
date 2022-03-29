// Dependencies
import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

// Types
import {
  AddShowInput,
  LoadShowByIdInput,
  BaseShowType,
  LinkSongInput,
  ListShowsInput,
  RemoveShowByIdInput,
  ReorderShowInput,
  ShowType,
  UnlinkSongInput,
  UpdateShowInput
} from '@/domain/protocols'

// Commands & Queries
import {
  AddShowCommand,
  LinkSongCommand,
  ListShowsQuery,
  LoadShowQuery,
  RemoveShowCommand,
  ReorderShowCommand,
  TokenPayload,
  UnlinkSongCommand,
  UpdateShowCommand,
  LoadPendingShowsQuery
} from '@/data/protocols'

// Authenticator
import { Roles, Role, GqlUserDecorator } from '@/main/decorators' 

// Schemas
import { Song } from '@/domain/entities'

@Resolver('Shows')
@Injectable()
export class ShowResolver {
  // Dependencies Injection
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  /**
   * Loads a show from a band
   * @param params - Check LoadShowByIdInput for details
   */
  @Query(() => ShowType)
  @Roles(Role.player, Role.master)
  async show(
    @Args(LoadShowByIdInput.name) params: LoadShowByIdInput,
    @GqlUserDecorator() payload: TokenPayload
  ): Promise<ShowType> {
    return this.queryBus.execute(new LoadShowQuery({ ...params }, payload))
  }

  /**
   * Loads pending shows from all bands
   */
   @Query(() => [ShowType])
   @Roles(Role.player, Role.master)
   async pendingShows(@GqlUserDecorator() payload: TokenPayload): Promise<ShowType[]> {
     return this.queryBus.execute(new LoadPendingShowsQuery(payload))
   }

  /**
   * Loads songs from a band
   * @param params - Check ListSongsInput for details
   */
  @Query(() => [ShowType])
  @Roles(Role.player, Role.master)
  async shows(
    @Args(ListShowsInput.name) params: ListShowsInput,
    @GqlUserDecorator() payload: TokenPayload
  ): Promise<Song[]> {
    return this.queryBus.execute(new ListShowsQuery({ ...params }, payload))
  }

  /**
   * Create Show Resolver
   * @param params - Check AddShowInput for details
   */
  @Mutation(() => BaseShowType)
  @Roles(Role.player, Role.master)
  async addShow(
    @Args(AddShowInput.name) params: AddShowInput,
    @GqlUserDecorator() payload: TokenPayload
  ): Promise<Song> {
    return this.commandBus.execute(new AddShowCommand({ ...params }, payload))
  }

  /**
   * Update Show Resolver
   * @param params - Check UpdateShowInput for details
   */
  @Mutation(() => BaseShowType)
  @Roles(Role.player, Role.master)
  async updateShow(
    @Args(UpdateShowInput.name) params: UpdateShowInput,
    @GqlUserDecorator() payload: TokenPayload
  ): Promise<Song> {
    return this.commandBus.execute(new UpdateShowCommand({ ...params }, payload))
  }

  /**
   * Reorder Show Resolver
   * @param params - Check ReorderShowInput for details
   */
  @Mutation(() => BaseShowType)
  @Roles(Role.player, Role.master)
  async reorderShow(
    @Args(ReorderShowInput.name) params: ReorderShowInput,
    @GqlUserDecorator() payload: TokenPayload
  ): Promise<Song> {
    return this.commandBus.execute(new ReorderShowCommand({ ...params }, payload))
  }

  /**
   * Remove Show Resolver
   * @param params - Check RemoveShowByIdInput for details
   */
  @Mutation(() => BaseShowType)
  @Roles(Role.player, Role.master)
  async removeShow(
    @Args(RemoveShowByIdInput.name) params: RemoveShowByIdInput,
    @GqlUserDecorator() payload: TokenPayload
  ): Promise<Song> {
    return this.commandBus.execute(new RemoveShowCommand({ ...params }, payload))
  }

  /**
   * Unlink song resolver
   * @param params - Check UnlinkSongInput for details
   */
  @Mutation(() => BaseShowType)
  @Roles(Role.player, Role.master)
  async unlinkSong(
    @Args(UnlinkSongInput.name) params: UnlinkSongInput,
    @GqlUserDecorator() payload: TokenPayload
  ): Promise<Song> {
    return this.commandBus.execute(new UnlinkSongCommand({ ...params }, payload))
  }

  /**
   * Link song resolver
   * @param params - Check LinkSongInput for details
   */
   @Mutation(() => BaseShowType)
   @Roles(Role.player, Role.master)
   async linkSong(
     @Args(LinkSongInput.name) params: LinkSongInput,
     @GqlUserDecorator() payload: TokenPayload
   ): Promise<Song> {
     return this.commandBus.execute(new LinkSongCommand({ ...params }, payload))
   }
}
