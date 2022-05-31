// Dependencies
import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { Resolver, Args, Mutation } from '@nestjs/graphql'

// Types
import {
  AuthenticateInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  TokenType,
  AccountType
} from '@/domain/protocols'

// Commands & Queries
import {
  AuthenticateCommand,
  ForgotPasswordCommand,
  ResetPasswordCommand
} from '@/data/protocols'

// Authenticator
import { SkipAuth } from '@/main/decorators' 

@Resolver('Authentication')
@Injectable()
export class AuthResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  /**
   * Authenticate Resolver
   * @param params - Check AuthenticateInput for details
   */
  @Mutation(() => TokenType)
  @SkipAuth()
  async authenticate(
    @Args(AuthenticateInput.name) params: AuthenticateInput
  ): Promise<TokenType> {
    return this.commandBus.execute(new AuthenticateCommand({ ...params }))
  }

  /**
   * Forgot password Resolver
   * @param params - Check ForgotPasswordInput for details
   */
  @Mutation(() => TokenType)
  @SkipAuth()
  async forgotPassword(
    @Args(ForgotPasswordInput.name) params: ForgotPasswordInput
  ): Promise<TokenType> {
    return this.commandBus.execute(new ForgotPasswordCommand({ ...params }))
  }

  /**
   * Reset password Resolver
   * @param params - Check ResetPasswordInput for details
   */
  @Mutation(() => AccountType)
  @SkipAuth()
  async resetPassword(
    @Args(ResetPasswordInput.name) params: ResetPasswordInput
  ): Promise<TokenType> {
    return this.commandBus.execute(new ResetPasswordCommand({ ...params }))
  }
}
