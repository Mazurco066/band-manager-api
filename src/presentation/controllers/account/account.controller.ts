// Dependencies
import { Injectable, Controller, Body, Param, Get, Post, Put, Delete, Query } from '@nestjs/common'
import { AccountService } from '../../services/account'
import { IBaseResponse } from '@/domain/shared'

// API Documentation
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

// Authorization
import { SkipAuth, Roles, Role, JwtUserDecorator } from '@/main/decorators'
import { TokenPayload } from '@/data/protocols'

// Inputs
import {
  AddAccountInput,
  ListAccountsInput,
  LoadAccountByEmailInput,
  UpdateAccountInput,
  VerifyAccountInput
} from '@/domain/protocols'

@ApiTags('Accounts')
@Controller('api/v1/accounts')
@Injectable()
export class AccountController {
  // Dependencies Injection
  constructor(
    private readonly accountService: AccountService,
  ) {}

  /**
   * List accounts
   * @param params - Limit and offset params
   * @param payload - Token payload
   * @returns - Base response containing accounts list
   */
  @Get('/get')
  @ApiOperation({
    summary: 'List accounts',
    description: 'List active user accounts.'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns current account list.'
  })
  @Roles(Role.player, Role.master)
  async listAccounts(
    @Query() params: ListAccountsInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.accountService.listAccount(params, payload)
  }

  /**
   * Load account by id endpoint
   * @param id - Account id
   * @param payload - Token payload
   * @returns - Base response containing account
   */
  @Get('/get/:id')
  @ApiOperation({
    summary: 'Get account by id',
    description: 'Returns a account object that matches with the id parameter.'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a account object that matches with the id parameter.'
  })
  @Roles(Role.player, Role.master)
  async loadAccountById(
    @Param('id') id: string,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.accountService.loadAccountById(id, payload)
  }
 
  /**
   * Load account by username
   * @param params - Account username
   * @param payload - Token payload
   * @returns - Base response containing account
   */
  @Post('/account_by_username')
  @ApiOperation({
    summary: 'Get account by username',
    description: 'Returns a account object that matches with the username parameter.'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a account object that matches with the username parameter.'
  })
  @Roles(Role.player, Role.master)
  async loacAccountByUsername(
    @Body() params: LoadAccountByEmailInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.accountService.loadAccountByUsername(params, payload)
  }

  /**
   * Get current account
   * @param payload - Token payload
   * @returns - Base response containing account
   */
  @Get('/me')
  @ApiOperation({
    summary: 'Get authenticated account',
    description: 'Returns the authenticated account object.'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the authenticated account object.'
  })
  async loadMe(
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.accountService.loadMe(payload)
  }

  /**
   * Add account to app
   * @param params - Account data
   * @returns - Base response contaning account
   */
  @Post()
  @SkipAuth()
  @ApiOperation({
    summary: 'Create account',
    description: 'Returns the created account object.'
  })
  @ApiResponse({
    status: 201,
    description: 'Returns the created account object.'
  })
  async addAccount(
    @Body() params: AddAccountInput
  ): Promise<IBaseResponse> {
    return this.accountService.addAccount(params)
  }

  /**
   * Updated account data
   * @param id - Account id
   * @param params - Account data
   * @param payload - Token payload
   * @returns - Base response containing account
   */
  @Put('/:id')
  @Roles(Role.player, Role.master)
  @ApiOperation({
    summary: 'Update account data',
    description: 'Returns the updated account object.'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated account object.'
  })
  async updateAccount(
    @Param('id') id: string,
    @Body() params: UpdateAccountInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.accountService.updateAccount(id, params, payload)
  }

  /**
   * Removes account from app
   * @param id - Account id
   * @param payload - Token payload
   * @returns - Base response containing account
   */
  @Delete('/:id')
  @Roles(Role.player, Role.master)
  @ApiOperation({
    summary: 'Remove account',
    description: 'Returns the deleted account object.'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the deleted account object.'
  })
  async removeAccount(
    @Param('id') id: string,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.accountService.removeAccount(id, payload)
  }

  /**
   * Verify account E-mail
   * @param params - Account code
   * @param payload - Token payload
   * @returns - Base response containing account
   */
  @Post('/verify_account')
  @Roles(Role.player, Role.master)
  @ApiOperation({
    summary: 'Verify account E-mail',
    description: 'Validate account E-mail based on received code (present in verification E-mail).'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the validated account.'
  })
  async verifyAccount(
    @Body() params: VerifyAccountInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.accountService.verifyAccount(params, payload)
  }

  /**
   * Resend confirmation email
   * @param payload - Token payload
   * @returns - Base response containing account
   */
  @Post('/resend_verification_email')
  @Roles(Role.player, Role.master)
  @ApiOperation({
    summary: 'Resend verification E-mail',
    description: 'Request a new verification E-mail for account validation.'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a message informing that a new verification E-mail was sent.'
  })
  async resendVerificationCode(
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.accountService.resendVerification(payload)
  }
}
