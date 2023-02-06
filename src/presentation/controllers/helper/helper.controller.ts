// Dependencies
import { Injectable, Controller, Body, Post, Get } from '@nestjs/common'
import { HelperService } from '../../services/helper'
import { IBaseResponse } from '@/domain/shared'

// API Documentation
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

// Authorization
import { Roles, Role, JwtUserDecorator, SkipAuth } from '@/main/decorators'
import { TokenPayload } from '@/data/protocols'

// Inputs
import {
  DailyLiturgyInput,
  ScrapSongInput
} from '@/domain/protocols'

@ApiTags('Helpers')
@Controller('api/v1/helpers')
@Injectable()
export class HelperController {
  // Dependencies Injection
  constructor(
    private readonly helperService: HelperService
  ) {}

  /**
   * Scraps a song from cifra club or cifras.com
   * @param params - Song url
   * @param payload - Token payload
   * @returns - Base response containing scraped song
   */
  @Post('/scrap_song')
  @Roles(Role.player, Role.master)
  @ApiOperation({
    summary: 'Scrap Song',
    description: 'Search a song in Cifra Club or Cifras website.'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the scrapped song as text.'
  })
  async scrapSong(
    @Body() params: ScrapSongInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.helperService.scrapSong(params, payload)
  }

  /**
   * Scraps a song from cifra club or cifras.com
   * @param params - Song url
   * @param payload - Token payload
   * @returns - Base response containing scraped song
   */
  @Post('/daily_liturgy')
  @Roles(Role.player, Role.master)
  @ApiOperation({
    summary: 'Daily Liturgy',
    description: 'Searchs daily liturgy into pocketterço website.'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the scrapped liturgy as array.'
  })
  async dailyLiturgy(
    @Body() params: DailyLiturgyInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.helperService.dailyLiturgy(params, payload)
  }

  @Get('/service_status')
  @SkipAuth()
  @ApiOperation({
    summary: 'Service status',
    description: 'Returns if API service is online.'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the service status as string'
  })
  async isServiceAvailable() {
    return this.helperService.isServiceAvailable()
  }
}
