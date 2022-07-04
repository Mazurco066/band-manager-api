// Dependencies
import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

// Types
import {
  AddObservationInput,
  AddShowInput,
  LoadShowByIdInput,
  BaseShowType,
  LinkSongInput,
  ListShowsInput,
  RemoveObservationInput,
  RemoveShowByIdInput,
  ReorderShowInput,
  ShowType,
  UnlinkSongInput,
  UpdateObservationInput,
  UpdateShowInput
} from '@/domain/protocols'

// Commands & Queries
import {
  AddObservationCommand,
  AddShowCommand,
  LinkSongCommand,
  ListShowsQuery,
  ListShowsByAccountQuery,
  LoadShowQuery,
  RemoveObservationCommand,
  RemoveShowCommand,
  ReorderShowCommand,
  TokenPayload,
  UnlinkSongCommand,
  UpdateObservationCommand,
  UpdateShowCommand,
  LoadPendingShowsQuery
} from '@/data/protocols'

// Authenticator
import { Roles, Role, GqlUserDecorator } from '@/main/decorators' 

// Schemas
import { Show } from '@/domain/entities'

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
   * Loads account shows from all bounded bands
   */
   @Query(() => [ShowType])
   @Roles(Role.player, Role.master)
   async accountShows(@GqlUserDecorator() payload: TokenPayload): Promise<ShowType[]> {
     return this.queryBus.execute(new ListShowsByAccountQuery(payload))
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
  ): Promise<Show[]> {
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
  ): Promise<Show> {
    return this.commandBus.execute(new AddShowCommand({ ...params }, payload))
  }

  /**
   * Add observation Resolver
   * @param params - Check AddObservationInput for details
   */
  @Mutation(() => BaseShowType)
  @Roles(Role.player, Role.master)
  async addObservation(
    @Args(AddObservationInput.name) params: AddObservationInput,
    @GqlUserDecorator() payload: TokenPayload
  ): Promise<Show> {
    return this.commandBus.execute(new AddObservationCommand({ ...params }, payload))
  }

  /**
   * Update observation Resolver
   * @param params - Check UpdateObservationInput for details
   */
  @Mutation(() => BaseShowType)
  @Roles(Role.player, Role.master)
  async updateObservation(
    @Args(UpdateObservationInput.name) params: UpdateObservationInput,
    @GqlUserDecorator() payload: TokenPayload
  ): Promise<Show> {
    return this.commandBus.execute(new UpdateObservationCommand({ ...params }, payload))
  }

  /**
   * Remove observation Resolver
   * @param params - Check RemoveObservationInput for details
   */
  @Mutation(() => BaseShowType)
  @Roles(Role.player, Role.master)
  async removeObservation(
    @Args(RemoveObservationInput.name) params: RemoveObservationInput,
    @GqlUserDecorator() payload: TokenPayload
  ): Promise<Show> {
    return this.commandBus.execute(new RemoveObservationCommand({ ...params }, payload))
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
  ): Promise<Show> {
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
  ): Promise<Show> {
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
  ): Promise<Show> {
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
  ): Promise<Show> {
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
   ): Promise<Show> {
     return this.commandBus.execute(new LinkSongCommand({ ...params }, payload))
   }
}
