// Dependencies
import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { baseResponse, IBaseResponse } from '@/domain/shared'

// Inputs
import {
  AddAccountInput,
  LoadAccountByEmailInput,
  UpdateAccountInput,
  VerifyAccountInput
} from '@/domain/protocols'

// Commands and queries
import {
  LoadAccountByIdQuery,
  LoadAccountByEmailQuery,
  LoadMeQuery,
  AddAccountCommand,
  UpdateAccountCommand,
  RemoveAccountCommand,
  VerifyAccountCommand,
  ResendVerificationCommand,
  TokenPayload
} from '@/data/protocols'

@Injectable()
export class AccountService {
// Dependencies Injection
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  // Load account by Id query
  async loadAccountById(id: string, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.queryBus.execute(new LoadAccountByIdQuery(id, payload))
    return baseResponse(200, 'Conta recuperada com sucesso!', response)
  }

  // Load account by Username query
  async loadAccountByUsername(params: LoadAccountByEmailInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.queryBus.execute(new LoadAccountByEmailQuery(params, payload))
    return baseResponse(200, 'Conta recuperada com sucesso!', response)
  }

  // Load me query
  async loadMe(payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.queryBus.execute(new LoadMeQuery(payload))
    return baseResponse(200, 'Conta recuperada com sucesso!', response)
  }

  // Add account command
  async addAccount(params: AddAccountInput): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new AddAccountCommand(params))
    return baseResponse(200, 'Sua conta foi criada com sucesso!', response)
  }

  // Update account command
  async updateAccount(id: string, params: UpdateAccountInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new UpdateAccountCommand(id, params, payload))
    return baseResponse(200, 'Sua conta foi atualizada com sucesso!', response)
  }

  // Remove Account command
  async removeAccount(id: string, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new RemoveAccountCommand(id, payload))
    return baseResponse(200, 'Sua conta foi removida com sucesso!', response)
  }

  // Verify account command
  async verifyAccount(params: VerifyAccountInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new VerifyAccountCommand(params, payload))
    return baseResponse(200, 'Sua conta foi ativada com sucesso!', response)
  }

  // Resend verification command
  async resendVerification(payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new ResendVerificationCommand(payload))
    return baseResponse(200, 'E-mail de confirmação foi re-enviado!', response)
  }
}
