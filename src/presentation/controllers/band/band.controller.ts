// Dependencies
import { Injectable, Controller, Param, Body, Query, Get, Post, Put, Delete } from '@nestjs/common'
import { BandService } from '../../services/band'
import { IBaseResponse } from '@/domain/shared'

// Authorization
import { Roles, Role, JwtUserDecorator } from '@/main/decorators'
import { TokenPayload } from '@/data/protocols'

// Inputs
import {
  AddBandInput,
  AddMemberInput,
  PromoteMemberInput,
  RemoveMemberInput,
  DemoteMemberInput,
  UpdateBandInput,
  ListBandsInput
} from '@/domain/protocols'

@Controller('api/v1/bands')
@Injectable()
export class BandController {
  // Dependencies Injection
  constructor(
    private readonly bandService: BandService
  ) {}

  @Get('/get/:id')
  @Roles(Role.player, Role.master)
  async loadBandById(
    @Param('id') id: string,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.bandService.loadBandById(id, payload)
  }

  @Get('/get')
  @Roles(Role.player, Role.master)
  async listBands(
    @Query() params: ListBandsInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.bandService.listBands(params, payload)
  }

  @Post()
  @Roles(Role.player, Role.master)
  async addBand(
    @Body() params: AddBandInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.bandService.addBand(params, payload)
  }

  @Put('/:id')
  @Roles(Role.player, Role.master)
  async updateBand(
    @Param('id') id: string,
    @Body() params: UpdateBandInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.bandService.updateBand(id, params, payload)
  }

  @Delete('/:id')
  @Roles(Role.player, Role.master)
  async removeBand(
    @Param('id') id: string,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.bandService.removeBand(id, payload)
  }

  @Post('/add_member/:id')
  @Roles(Role.player, Role.master)
  async addBandMember(
    @Param('id') id: string,
    @Body() params: AddMemberInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.bandService.addBandMember(id, params, payload)
  }

  @Post('/promote_member/:id')
  @Roles(Role.player, Role.master)
  async promoteBandMember(
    @Param('id') id: string,
    @Body() params: PromoteMemberInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.bandService.promoteBandMember(id, params, payload)
  }

  @Post('/remove_member/:id')
  @Roles(Role.player, Role.master)
  async removeBandMember(
    @Param('id') id: string,
    @Body() params: RemoveMemberInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.bandService.removeBandMember(id, params, payload)
  }

  @Post('/demote_member/:id')
  @Roles(Role.player, Role.master)
  async demoteBandMember(
    @Param('id') id: string,
    @Body() params: DemoteMemberInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.bandService.demoteBandMember(id, params, payload)
  }
}
