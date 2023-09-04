// Dependencies
import { Injectable, Controller, Body, Param, Query, Get, Post, Put, Delete, Patch } from '@nestjs/common'
import { ShowService } from '../../services/show'
import { IBaseResponse } from '@/domain/shared'

// API Documentation
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

// Authorization
import { Roles, Role, JwtUserDecorator } from '@/main/decorators'
import { TokenPayload } from '@/data/protocols'

// Inputs
import {
  AddObservationInput,
  AddShowInput,
  CloneConcertInput,
  LinkSongInput,
  ListShowsInput,
  ReorderShowInput,
  UnlinkSongInput,
  UpdateObservationInput,
  UpdateShowInput
} from '@/domain/protocols'

@ApiTags('Shows')
@Controller('api/v1/shows')
@Injectable()
export class ShowController {
  // Dependencies Injection
  constructor(
    private readonly showService: ShowService
  ) {}

  /**
   * Load show by id
   * @param id - Show id
   * @param payload - Token payload
   * @returns - Base response containing show
   */
  @Get('/:id')
  @Roles(Role.player, Role.master)
  @ApiOperation({
    summary: 'Get show',
    description: 'Get show by id'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the show that matches the requested id.'
  })
  async getShowById(
    @Param('id') id: string,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.showService.loadShowById(id, payload)
  }

  /**
   * List account shows
   * @param payload - Token payload
   * @returns - Base response containing shows
   */
  @Get('/get/account_shows')
  @Roles(Role.player, Role.master)
  @ApiOperation({
    summary: 'List account shows',
    description: 'List all shows from bands that authenticated user belongs'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of shows.'
  })
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
  @Get('/get/pending_shows')
  @Roles(Role.player, Role.master)
  @ApiOperation({
    summary: 'List pending shows',
    description: 'List all future shows from bands that authenticated user belongs'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of shows.'
  })
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
  @Get('/list/:bandId')
  @Roles(Role.player, Role.master)
  @ApiOperation({
    summary: 'List band shows',
    description: 'List all shows from a band'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of shows.'
  })
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
  @ApiOperation({
    summary: 'Create show',
    description: 'Add a new show to band register'
  })
  @ApiResponse({
    status: 201,
    description: 'Returns the created show.'
  })
  async addShow(
    @Body() params: AddShowInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.showService.addShow(params, payload)
  }

  /**
   * Clone show into band
   * @param params - Desired date
   * @param payload - Token payload
   * @returns - Base response containing show
   */
  @Post('/:id')
  @Roles(Role.player, Role.master)
  @ApiOperation({
    summary: 'Clone concert',
    description: 'Duplicates a concert into the same band'
  })
  @ApiResponse({
    status: 201,
    description: 'Returns the duplicated concert.'
  })
  async cloneConcert(
    @Param('id') id: string,
    @Body() params: CloneConcertInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.showService.cloneConcert(id, params, payload)
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
  @ApiOperation({
    summary: 'Add show observation',
    description: 'Add a text observation to show'
  })
  @ApiResponse({
    status: 201,
    description: 'Returns the updated show.'
  })
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
  @ApiOperation({
    summary: 'Update show observation',
    description: 'Updates a show text observation'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated show.'
  })
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
  @ApiOperation({
    summary: 'Remove show observation',
    description: 'Delete a show text observation'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated show.'
  })
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
  @ApiOperation({
    summary: 'Update show',
    description: 'Update show data'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated show.'
  })
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
  @ApiOperation({
    summary: 'Reorder show songs',
    description: 'Reorder songs from a show'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated show.'
  })
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
  @ApiOperation({
    summary: 'Remove show',
    description: 'Delete show by id'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the deleted show.'
  })
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
  @ApiOperation({
    summary: 'Unlink show song',
    description: 'Remove the requested song from show'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated show.'
  })
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
  @ApiOperation({
    summary: 'Link show song',
    description: 'Add the requested song from show'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated show.'
  })
  async linkSong(
    @Param('id') id: string,
    @Body() params: LinkSongInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.showService.linkSong(id, params, payload)
  }
}
