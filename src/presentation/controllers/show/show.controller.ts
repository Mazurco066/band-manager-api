// Dependencies
import { Injectable, Controller, Body, Param, Query, Get, Post, Put, Delete, Patch } from '@nestjs/common'
import { ShowService } from '../../services/show'
import { IBaseResponse } from '@/domain/shared'

// Authorization
import { Roles, Role, JwtUserDecorator } from '@/main/decorators'
import { TokenPayload } from '@/data/protocols'

// Inputs
import {
  AddObservationInput,
  AddShowInput,
  LinkSongInput,
  ListShowsInput,
  ReorderShowInput,
  UnlinkSongInput,
  UpdateObservationInput,
  UpdateShowInput
} from '@/domain/protocols'

@Controller('api/v1/shows')
@Injectable()
export class ShowController {
  // Dependencies Injection
  constructor(
    private readonly showService: ShowService
  ) {}

  /**
   * Load show by id
   * @param bandId - Band id
   * @param id - Show id
   * @param payload - Token payload
   * @returns - Base response containing show
   */
  @Get('/get/:bandId/:id')
  @Roles(Role.player, Role.master)
  async getShowById(
    @Param('bandId') bandId: string,
    @Param('id') id: string,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.showService.loadShowById(bandId, id, payload)
  }

  /**
   * List account shows
   * @param payload - Token payload
   * @returns - Base response containing shows
   */
  @Get('/account_shows')
  @Roles(Role.player, Role.master)
   async accountShows(
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.showService.loadAccountShows(payload)
  }

  /**
   * List pending shows
   * @param payload - Token payload
   * @returns - Base response containing shows
   */
  @Get('/pending_shows')
  @Roles(Role.player, Role.master)
   async pendingShows(
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.showService.loadPendingShows(payload)
  }

  /**
   * List shows
   * @param bandId - Band id
   * @param params - Filters
   * @param payload - Token payloads
   * @returns - Base response containing shows
   */
  @Get('/get/:bandId/shows')
  @Roles(Role.player, Role.master)
  async listShows(
    @Param('bandId') bandId: string,
    @Query() params: ListShowsInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.showService.listShows(bandId, params, payload)
  }

  /**
   * Add show to a band
   * @param params - Show data
   * @param payload - Token payload
   * @returns - Base response containing show
   */
  @Post()
  @Roles(Role.player, Role.master)
  async addShow(
    @Body() params: AddShowInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.showService.addShow(params, payload)
  }

  /**
   * Adds a observation to a show
   * @param id - Show id
   * @param params - Observation data
   * @param payload - Token payload
   * @returns - Base response containing show
   */
  @Post('/:id/add_observation')
  @Roles(Role.player, Role.master)
  async addObservation(
    @Param('id') id: string,
    @Body() params: AddObservationInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.showService.addShowObservation(id, params, payload)
  }

  /**
   * Updates a show observation
   * @param showId - Show id
   * @param id - Observation id
   * @param params - Observation data
   * @param payload - Token payload
   * @returns - Base response containing show
   */
  @Put('/:show_id/:id/update_observation')
  @Roles(Role.player, Role.master)
  async updateObservation(
    @Param('show_id') showId: string,
    @Param('id') id: string,
    @Body() params: UpdateObservationInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.showService.updateShowObservation(id, showId, params, payload)
  }

  /**
   * Removes a observation from show
   * @param showId - Show id
   * @param id - Observation id
   * @param payload - Token payload
   * @returns - Base response containing show
   */
  @Post('/:show_id/:id/remove_observation')
  @Roles(Role.player, Role.master)
  async removeObservation(
    @Param('show_id') showId: string,
    @Param('id') id: string,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.showService.removeShowObservation(showId, id, payload)
  }

  /**
   * Updates a show
   * @param id - Show id
   * @param params - Show data
   * @param payload - Token payload
   * @returns - Base response containing show
   */
  @Put('/:id')
  @Roles(Role.player, Role.master)
  async updateShow(
    @Param('id') id: string,
    @Body() params: UpdateShowInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.showService.updateShow(id, params, payload)
  }

  /**
   * Reorder a show
   * @param id - Show id
   * @param params - Song order
   * @param payload - Token payload
   * @returns - Base response containing show
   */
  @Put('/:id/reorder')
  @Roles(Role.player, Role.master)
  async reorderShow(
    @Param('id') id: string,
    @Body() params: ReorderShowInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.showService.reorderShow(id, params, payload)
  }

  /**
   * Removes a show
   * @param id - Show id
   * @param payload - Token payload
   * @returns - Base response containing show
   */
  @Delete('/:id')
  @Roles(Role.player, Role.master)
  async removeShow(
    @Param('id') id: string,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.showService.removeShow(id, payload)
  }

  /**
   * Unlink song from show
   * @param id - Show id 
   * @param params - Song data
   * @param payload - Token payload
   * @returns - Base response containing show
   */
  @Patch('/:id/unlink_song')
  @Roles(Role.player, Role.master)
  async unlinkSong(
    @Param('id') id: string,
    @Body() params: UnlinkSongInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.showService.unlinkSong(id, params, payload)
  }

  /**
   * Links a song to a show
   * @param id - Show id
   * @param params - Song data
   * @param payload - Token payload
   * @returns - Base response containing show
   */
  @Patch('/:id/link_song')
  @Roles(Role.player, Role.master)
  async linkSong(
    @Param('id') id: string,
    @Body() params: LinkSongInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.showService.linkSong(id, params, payload)
  }
}
