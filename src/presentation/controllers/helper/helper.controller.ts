// Dependencies
import { Injectable, Controller, Body, Post } from '@nestjs/common'
import { HelperService } from '../../services/helper'
import { IBaseResponse } from '@/domain/shared'

// Authorization
import { Roles, Role, JwtUserDecorator } from '@/main/decorators'
import { TokenPayload } from '@/data/protocols'

// Inputs
import {
  ScrapSongInput
} from '@/domain/protocols'

@Controller('api/v1/helpers')
@Injectable()
export class HelperController {
  // Dependencies Injection
  constructor(
    private readonly helperService: HelperService
  ) {}

  @Post('/scrap_song')
  @Roles(Role.player, Role.master)
  async scrapSong(
    @Body() params: ScrapSongInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.helperService.scrapSong(params, payload)
  }
}
