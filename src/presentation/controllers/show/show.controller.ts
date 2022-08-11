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

  @Get('/:bandId/:id')
  @Roles(Role.player, Role.master)
  async getShowById(
    @Param('bandId') bandId: string,
    @Param('id') id: string,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.showService.loadShowById(bandId, id, payload)
  }

  @Get('/account_shows')
  @Roles(Role.player, Role.master)
   async accountShows(
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.showService.loadAccountShows(payload)
  }

  @Get('/pending_shows')
  @Roles(Role.player, Role.master)
   async pendingShows(
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.showService.loadPendingShows(payload)
  }

  @Get('/:bandId/shows')
  @Roles(Role.player, Role.master)
  async listShows(
    @Param('bandId') bandId: string,
    @Query() params: ListShowsInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.showService.listShows(bandId, params, payload)
  }

  @Post()
  @Roles(Role.player, Role.master)
  async addShow(
    @Body() params: AddShowInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.showService.addShow(params, payload)
  }

  @Post('/:id/add_observation')
  @Roles(Role.player, Role.master)
  async addObservation(
    @Param('id') id: string,
    @Body() params: AddObservationInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.showService.addShowObservation(id, params, payload)
  }

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

  @Post('/:show_id/:id/remove_observation')
  @Roles(Role.player, Role.master)
  async removeObservation(
    @Param('show_id') showId: string,
    @Param('id') id: string,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.showService.removeShowObservation(showId, id, payload)
  }

  @Put('/:id')
  @Roles(Role.player, Role.master)
  async updateShow(
    @Param('id') id: string,
    @Body() params: UpdateShowInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.showService.updateShow(id, params, payload)
  }

  @Put('/:id/reorder')
  @Roles(Role.player, Role.master)
  async reorderShow(
    @Param('id') id: string,
    @Body() params: ReorderShowInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.showService.reorderShow(id, params, payload)
  }

  @Delete('/:id')
  @Roles(Role.player, Role.master)
  async removeShow(
    @Param('id') id: string,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.showService.removeShow(id, payload)
  }

  @Patch('/:id/unlink_song')
  @Roles(Role.player, Role.master)
  async unlinkSong(
    @Param('id') id: string,
    @Body() params: UnlinkSongInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.showService.unlinkSong(id, params, payload)
  }

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
