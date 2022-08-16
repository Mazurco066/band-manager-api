// Dependencies
import { Injectable, Controller, Body, Post, Param } from '@nestjs/common'
import { AuthService } from '../../services/auth'
import { IBaseResponse } from '@/domain/shared'

// API Documentation
import { ApiTags } from '@nestjs/swagger'

// Inputs
import {
  AuthenticateInput,
  ForgotPasswordInput,
  ResetPasswordInput
} from '@/domain/protocols'

// Authorization
import { SkipAuth } from '@/main/decorators'

@ApiTags('Authentication')
@Controller('api/v1/auth')
@Injectable()
export class AuthController {
  // Dependencies Injection
  constructor(
    private readonly authService: AuthService
  ) {}

  /**
   * Authenticate endpoint
   * @param params - Authentication data
   * @returns - Base response containing authentication token
   */
  @Post('/authenticate')
  @SkipAuth()
  async authenticate(
    @Body() params: AuthenticateInput
  ): Promise<IBaseResponse> {
    return this.authService.authenticate(params)
  }

  /**
   * Forgot password endpoint
   * @param params - Account data
   * @returns - Base response containing a message
   */
  @Post('/forgot_password')
  @SkipAuth()
  async forgotPassword(
    @Body() params: ForgotPasswordInput
  ): Promise<IBaseResponse> {
    return this.authService.forgotPassword(params)
  }

  /**
   * Reset account password endpoint
   * @param id - Account id
   * @param params - New password
   * @returns - Base response containing account
   */
  @Post('/reset_password/:id')
  @SkipAuth()
  async resetPassword(
    @Param('id') id: string,
    @Body() params: ResetPasswordInput
  ): Promise<IBaseResponse> {
    return this.authService.resetPassword(id, params)
  }
}
