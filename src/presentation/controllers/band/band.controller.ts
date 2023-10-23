// Dependencies
import { Injectable, Controller, Param, Body, Query, Get, Post, Put, Delete } from '@nestjs/common'
import { BandService } from '../../services/band'
import { IBaseResponse } from '@/domain/shared'

// API Documentation
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

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
  @ApiOperation({
    summary: 'Get band',
    description: 'Get band by id'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a band that matches the informed id.'
  })
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
  @ApiOperation({
    summary: 'List bands',
    description: 'List account bands'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of bands that authenticated account belongs.'
  })
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
  @ApiOperation({
    summary: 'Create Band',
    description: 'Add a new band to account'
  })
  @ApiResponse({
    status: 201,
    description: 'Returns the created band.'
  })
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
  @ApiOperation({
    summary: 'Update Band',
    description: 'Updates band data'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated band.'
  })
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
  @ApiOperation({
    summary: 'Remove Band',
    description: 'Deletes a band based on id param'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the deleted band.'
  })
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
  @ApiOperation({
    summary: 'Add band member',
    description: 'Add a new member to band'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated band.'
  })
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
  @ApiOperation({
    summary: 'Promote band member',
    description: 'Promote a band member to admin'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated band.'
  })
  async promoteBandMember(
    @Param('id') id: string,
    @Body() params: PromoteMemberInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.bandService.promoteBandMember(id, params, payload)
  }

  /**
   * Transfers ownership from one member to another
   * @param id - Band id
   * @param params - Account data
   * @param payload - Token payload
   * @returns - Base response containing band
   */
  @Post('/transfer_ownership/:id')
  @Roles(Role.player, Role.master)
  @ApiOperation({
    summary: 'Transfer ownership',
    description: 'Transfers ownership from one member to another'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated band.'
  })
  async transferOwnership(
    @Param('id') id: string,
    @Body() params: PromoteMemberInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.bandService.transferOwnership(id, params, payload)
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
  @ApiOperation({
    summary: 'Remove band member',
    description: 'Removes a band member'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated band.'
  })
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
  @ApiOperation({
    summary: 'Revoke band member permissions',
    description: 'Turns a member into a normal user'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated band.'
  })
  async demoteBandMember(
    @Param('id') id: string,
    @Body() params: DemoteMemberInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.bandService.demoteBandMember(id, params, payload)
  }
}
