// Dependencies
import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

// Types
import {
  AddAccountInput,
  AccountType,
  LoadAccountByIdInput,
  UpdateAccountInput,
  RemoveAccountByIdInput
} from '@/domain/protocols'

// Commands & Queries
import {
  AddAccountCommand,
  LoadAccountByIdQuery,
  LoadMeQuery,
  TokenPayload,
  UpdateAccountCommand,
  RemoveAccountCommand
} from '@/data/protocols'

// Authenticator
import { SkipAuth, Roles, Role, GqlUserDecorator } from '@/main/decorators' 

// Schemas
import { Account } from '@/domain/entities'

@Resolver('Users')
@Injectable()
export class AccountResolver {
  // Dependencies Injection
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  /**
   * Loads account by id
   * @param params - Check LoadAccountByIdInput for details
   */
  @Query(() => AccountType)
  @Roles(Role.player, Role.master)
  async account(
    @Args(LoadAccountByIdInput.name) params: LoadAccountByIdInput,
    @GqlUserDecorator() payload: TokenPayload
  ): Promise<AccountType> {
    return this.queryBus.execute(new LoadAccountByIdQuery({ ...params }, payload))
  }

  /**
   * Loads current id
   * @param params - Check LoadAccountByIdInput for details
   */
   @Query(() => AccountType)
   async me(
     @GqlUserDecorator() payload: TokenPayload
   ): Promise<AccountType> {
     return this.queryBus.execute(new LoadMeQuery(payload))
   }

  /**
   * Create Account Resolver
   * @param params - Check AddAccountInput for details
   */
  @Mutation(() => AccountType)
  @SkipAuth()
  async addAccount(
    @Args(AddAccountInput.name) params: AddAccountInput
  ): Promise<Account> {
    return this.commandBus.execute(new AddAccountCommand({ ...params }))
  }

  /**
   * Update Account Resolver
   * @param params - Check UpdateAccountInput for details
   */
   @Mutation(() => AccountType)
   @Roles(Role.player, Role.master)
   async updateAccount(
     @Args(UpdateAccountInput.name) params: UpdateAccountInput,
     @GqlUserDecorator() payload: TokenPayload
   ): Promise<Account> {
     return this.commandBus.execute(new UpdateAccountCommand({ ...params }, payload))
   }

   /**
   * Remove Account Resolver
   * @param params - Check RemoveAccountByIdInput for details
   */
    @Mutation(() => AccountType)
    @Roles(Role.player, Role.master)
    async removeAccount(
      @Args(RemoveAccountByIdInput.name) params: RemoveAccountByIdInput,
      @GqlUserDecorator() payload: TokenPayload
    ): Promise<Account> {
      return this.commandBus.execute(new RemoveAccountCommand({ ...params }, payload))
    }
}
