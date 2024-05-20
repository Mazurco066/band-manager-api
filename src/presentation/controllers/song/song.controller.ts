// Dependencies
import { Injectable, Controller, Body, Query, Param, Post, Get, Put, Delete } from '@nestjs/common'
import { SongService } from '../../services/song'
import { IBaseResponse } from '@/domain/shared'

// API Documentation
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

// Authorization
import { Roles, Role, JwtUserDecorator, SkipAuth } from '@/main/decorators'
import { TokenPayload } from '@/data/protocols'

// Inputs
import {
  AddSongInput,
  UpdateSongInput,
  ListSongsInput,
  ListPublicSongsInput
} from '@/domain/protocols'

@ApiTags('Songs V2')
@Controller('api/v2/songs')
@Injectable()
export class SongControllerV2 {
  // Dependencies Injection
  constructor(
    private readonly songService: SongService
  ) {}

  @Get('/list/:bandId/:categoryId')
  @Roles(Role.player, Role.master)
  @ApiOperation({
    summary: 'List songs by a given category',
    description: 'List songs from a band by category'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of songs.'
  })
  async listSongsByCategory(
    @Param('bandId') bandId: string,
    @Param('categoryId') categoryId: string,
    @Query() params: ListSongsInput,
    @JwtUserDecorator() payload: TokenPayload
  ) {
    return this.songService.listSongsByCategory(bandId, categoryId, params, payload)
  }

  @Delete('/wipe_account_data')
  @Roles(Role.player, Role.master)
  @ApiOperation({
    summary: 'Wipe data from authenticated account',
    description: 'Wipe data from authenticated account (Be carefull when using this endpoint. Its was developed to serve as delete account to fit google play store security requests).'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns deleted account'
  })
  async wipeAccountData(
    @JwtUserDecorator() payload: TokenPayload
  ) {
    return this.songService.removeAccountAndBandData(payload)
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Get song',
    description: 'Get song by id'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the song that matches the requested id and is public.'
  })
  @SkipAuth()
  async publicSong(
    @Param('id') id: string,
  ): Promise<IBaseResponse> {
    return this.songService.loadPublicSongById(id)
  }
}

@ApiTags('Songs')
@Controller('api/v1/songs')
@Injectable()
export class SongController {
  // Dependencies Injection
  constructor(
    private readonly songService: SongService
  ) {}

  /**
   * Add a song to band
   * @param bandId - Band id
   * @param params - Song data
   * @param payload - Token payload
   * @returns - Base response containing song
   */
  @Post('/:bandId')
  @Roles(Role.player, Role.master)
  @ApiOperation({
    summary: 'Create song',
    description: 'Add a new song to band'
  })
  @ApiResponse({
    status: 201,
    description: 'Returns the created song.'
  })
  async addSong(
    @Param('bandId') bandId: string,
    @Body() params: AddSongInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.songService.addSong(bandId, params, payload)
  }
 
  /**
   * Removes a song
   * @param id - Song id
   * @param payload - Token payload
   * @returns - Base response containing song
   */
  @Delete('/:id')
  @Roles(Role.player, Role.master)
  @ApiOperation({
    summary: 'Remove song',
    description: 'Remove a song from band'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the deleted song.'
  })
  async removeSong(
    @Param('id') id: string,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.songService.removeSong(id, payload)
  }
 
  /**
   * Updates a song
   * @param id - Song id
   * @param params - Song data
   * @param payload - Token payload
   * @returns - Base response containing song
   */
  @Put('/:id')
  @Roles(Role.player, Role.master)
  @ApiOperation({
    summary: 'Update song',
    description: 'Update a song from band'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated song.'
  })
  async updateSong(
    @Param('id') id: string,
    @Body() params: UpdateSongInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.songService.updateSong(id, params, payload)
  }
 
  /**
   * Loads a single song
   * @param id - Song id
   * @param payload - Token payload
   * @returns - Base response containing song
   */
  @Get('/:id')
  @Roles(Role.player, Role.master)
  @ApiOperation({
    summary: 'Get song',
    description: 'Get song by id'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the song that matches the requested id.'
  })
  async song(
    @Param('id') id: string,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.songService.loadSongById(id, payload)
  }
 
  /**
   * List songs from a band
   * @param bandId - Band id
   * @param params - Filter
   * @param payload - Token payload
   * @returns - Base response containing songs
   */
  @Get('/list/:bandId')
  @Roles(Role.player, Role.master)
  @ApiOperation({
    summary: 'List songs',
    description: 'List songs from a band'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of songs.'
  })
  async songs(
    @Param('bandId') bandId: string,
    @Query() params: ListSongsInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.songService.listSongs(bandId, params, payload)
  }
 
  /**
   * List public songs
   * @param params - Filter
   * @param payload - Token payload
   * @returns - Base response containing songs
   */
  @Get('/get/public_songs')
  @ApiOperation({
    summary: 'List public songs',
    description: 'List all public songs from every band'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of songs.'
  })
  @SkipAuth()
  async publicSongs(
    @Query() params: ListPublicSongsInput,
  ): Promise<IBaseResponse> {
    return this.songService.listPublicSongs(params)
  }
}
