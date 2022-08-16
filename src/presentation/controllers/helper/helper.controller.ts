// Dependencies
import { Injectable, Controller, Body, Post } from '@nestjs/common'
import { HelperService } from '../../services/helper'
import { IBaseResponse } from '@/domain/shared'

// API Documentation
import { ApiTags } from '@nestjs/swagger'

// Authorization
import { Roles, Role, JwtUserDecorator } from '@/main/decorators'
import { TokenPayload } from '@/data/protocols'

// Inputs
import {
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
  async scrapSong(
    @Body() params: ScrapSongInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.helperService.scrapSong(params, payload)
  }
}
