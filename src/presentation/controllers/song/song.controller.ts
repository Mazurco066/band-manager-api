// Dependencies
import { Injectable, Controller, Body, Query, Param, Post, Get, Put, Delete } from '@nestjs/common'
import { SongService } from '../../services/song'
import { IBaseResponse } from '@/domain/shared'

// Authorization
import { Roles, Role, JwtUserDecorator } from '@/main/decorators'
import { TokenPayload } from '@/data/protocols'

// Inputs
import {
  AddSongInput,
  UpdateSongInput,
  ListSongsInput,
  ListPublicSongsInput
} from '@/domain/protocols'

@Controller('api/v1/songs')
@Injectable()
export class SongController {
  // Dependencies Injection
  constructor(
    private readonly songService: SongService
  ) {}

  @Post('/:bandId')
  @Roles(Role.player, Role.master)
  async addSong(
    @Param('bandId') bandId: string,
    @Body() params: AddSongInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.songService.addSong(bandId, params, payload)
  }
 
  @Delete('/:id')
  @Roles(Role.player, Role.master)
  async removeSong(
    @Param('id') id: string,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.songService.removeSong(id, payload)
  }
 
  @Put('/:id')
  @Roles(Role.player, Role.master)
  async updateSong(
    @Param('id') id: string,
    @Body() params: UpdateSongInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.songService.updateSong(id, params, payload)
  }
 
  @Get('/:bandId/:id')
  @Roles(Role.player, Role.master)
  async song(
    @Param('id') id: string,
    @Param('bandId') bandId: string,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.songService.loadSongById(id, bandId, payload)
  }
 
  @Get('/:bandId')
  @Roles(Role.player, Role.master)
  async songs(
    @Param('bandId') bandId: string,
    @Query() params: ListSongsInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.songService.listSongs(bandId, params, payload)
  }
 
  @Get('/public_songs')
  async publicSongs(
    @Query() params: ListPublicSongsInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.songService.listPublicSongs(params, payload)
  }
}
