// Dependencies
import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { baseResponse, IBaseResponse, sanitizeJson } from '@/domain/shared'

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
    const safeResponse = sanitizeJson(response, ['_id', '__v', 'password'])
    return baseResponse(200, 'Conta recuperada com sucesso!', safeResponse)
  }

  // Load account by Username query
  async loadAccountByUsername(params: LoadAccountByEmailInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.queryBus.execute(new LoadAccountByEmailQuery(params, payload))
    const safeResponse = sanitizeJson(response, ['_id', '__v', 'password'])
    return baseResponse(200, 'Conta recuperada com sucesso!', safeResponse)
  }

  // Load me query
  async loadMe(payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.queryBus.execute(new LoadMeQuery(payload))
    const safeResponse = sanitizeJson(response, ['_id', '__v', 'password'])
    return baseResponse(200, 'Conta recuperada com sucesso!', safeResponse)
  }

  // Add account command
  async addAccount(params: AddAccountInput): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new AddAccountCommand(params))
    const safeResponse = sanitizeJson(response, ['_id', '__v', 'password'])
    return baseResponse(201, 'Sua conta foi criada com sucesso!',  safeResponse)
  }

  // Update account command
  async updateAccount(id: string, params: UpdateAccountInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new UpdateAccountCommand(id, params, payload))
    const safeResponse = sanitizeJson(response, ['_id', '__v', 'password'])
    return baseResponse(200, 'Sua conta foi atualizada com sucesso!', safeResponse)
  }

  // Remove Account command
  async removeAccount(id: string, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new RemoveAccountCommand(id, payload))
    const safeResponse = sanitizeJson(response, ['_id', '__v', 'password'])
    return baseResponse(200, 'Sua conta foi removida com sucesso!', safeResponse)
  }

  // Verify account command
  async verifyAccount(params: VerifyAccountInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new VerifyAccountCommand(params, payload))
    const safeResponse = sanitizeJson(response, ['_id', '__v', 'password'])
    return baseResponse(200, 'Sua conta foi ativada com sucesso!', safeResponse)
  }

  // Resend verification command
  async resendVerification(payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new ResendVerificationCommand(payload))
    const safeResponse = sanitizeJson(response, ['_id', '__v', 'password'])
    return baseResponse(200, 'E-mail de confirmação foi re-enviado!', safeResponse)
  }
}
