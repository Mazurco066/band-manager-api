// Dependencies
import { Injectable, Controller, Param, Body, Query, Get, Post, Put, Delete } from '@nestjs/common'
import { BandService } from '../../services/band'
import { IBaseResponse } from '@/domain/shared'

// API Documentation
import { ApiTags } from '@nestjs/swagger'

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

@ApiTags('Bands')
@Controller('api/v1/bands')
@Injectable()
export class BandController {
  // Dependencies Injection
  constructor(
    private readonly bandService: BandService
  ) {}

  /**
   * Load band by id
   * @param id - Band id
   * @param payload - Token payload
   * @returns - Base response containing band
   */
  @Get('/get/:id')
  @Roles(Role.player, Role.master)
  async loadBandById(
    @Param('id') id: string,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.bandService.loadBandById(id, payload)
  }

  /**
   * List bands
   * @param params - Filters
   * @param payload - Token payload
   * @returns - Base response containing a list of bands
   */
  @Get('/get')
  @Roles(Role.player, Role.master)
  async listBands(
    @Query() params: ListBandsInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.bandService.listBands(params, payload)
  }

  /**
   * Creates a band
   * @param params - Band data
   * @param payload - Token payload
   * @returns - Base response containing band
   */
  @Post()
  @Roles(Role.player, Role.master)
  async addBand(
    @Body() params: AddBandInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.bandService.addBand(params, payload)
  }

  /**
   * Updates a band
   * @param id - Band id
   * @param params - Band data
   * @param payload - Token payload
   * @returns - Base response containing band
   */
  @Put('/:id')
  @Roles(Role.player, Role.master)
  async updateBand(
    @Param('id') id: string,
    @Body() params: UpdateBandInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.bandService.updateBand(id, params, payload)
  }

  /**
   * Removes a band from database
   * @param id - Band id
   * @param payload - Token payload
   * @returns - Base response containing band
   */
  @Delete('/:id')
  @Roles(Role.player, Role.master)
  async removeBand(
    @Param('id') id: string,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.bandService.removeBand(id, payload)
  }

  /**
   * Add a mamber to a band
   * @param id - Band id
   * @param params - Account data
   * @param payload - Token payload
   * @returns - Base response containing band
   */
  @Post('/add_member/:id')
  @Roles(Role.player, Role.master)
  async addBandMember(
    @Param('id') id: string,
    @Body() params: AddMemberInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.bandService.addBandMember(id, params, payload)
  }

  /**
   * Promotes a member in band
   * @param id - Band id
   * @param params - Account data
   * @param payload - Token payload
   * @returns - Base response containing band
   */
  @Post('/promote_member/:id')
  @Roles(Role.player, Role.master)
  async promoteBandMember(
    @Param('id') id: string,
    @Body() params: PromoteMemberInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.bandService.promoteBandMember(id, params, payload)
  }

  /**
   * Removes a member from band
   * @param id - Band id
   * @param params - Account data
   * @param payload - Token payload
   * @returns - Base response containing band
   */
  @Post('/remove_member/:id')
  @Roles(Role.player, Role.master)
  async removeBandMember(
    @Param('id') id: string,
    @Body() params: RemoveMemberInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.bandService.removeBandMember(id, params, payload)
  }

  /**
   * Demotes a member from band
   * @param id - Band id
   * @param params - Account data
   * @param payload - Token payload
   * @returns - Base response containing band
   */
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
