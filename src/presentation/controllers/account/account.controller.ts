// Dependencies
import { Injectable, Controller, Body, Param, Get, Post, Put, Delete } from '@nestjs/common'
import { AccountService } from '../../services/account'
import { IBaseResponse } from '@/domain/shared'

// Authorization
import { SkipAuth, Roles, Role, JwtUserDecorator } from '@/main/decorators'
import { TokenPayload } from '@/data/protocols'

// Inputs
import {
  AddAccountInput,
  LoadAccountByEmailInput,
  UpdateAccountInput,
  VerifyAccountInput
} from '@/domain/protocols'

@Controller('api/v1/accounts')
@Injectable()
export class AccountController {
  // Dependencies Injection
  constructor(
    private readonly accountService: AccountService,
  ) {}

  /**
   * Load account by id endpoint
   * @param id - Account id
   * @param payload - Token payload
   * @returns - Base response containing account
   */
  @Get('/get/:id')
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
  @Delete()
  @Roles(Role.player, Role.master)
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
  async resendVerificationCode(
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.accountService.resendVerification(payload)
  }
}
