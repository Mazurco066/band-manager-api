// Dependencies
import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { Resolver, Args, Mutation } from '@nestjs/graphql'

// Types
import { AuthenticateInput, TokenType } from '@/domain/protocols'

// Commands & Queries
import { AuthenticateCommand } from '@/data/protocols'

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

}