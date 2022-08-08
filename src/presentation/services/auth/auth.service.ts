// Dependencies
import { Injectable } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { baseResponse, IBaseResponse } from '@/domain/shared'

// Inputs
import {
  AuthenticateInput,
  ForgotPasswordInput,
  ResetPasswordInput
} from '@/domain/protocols'

// Commands and queries
import {
  AuthenticateCommand,
  ForgotPasswordCommand,
  ResetPasswordCommand
} from '@/data/protocols'

@Injectable()
export class AuthService {
  // Dependencies Injection
  constructor(
    private readonly commandBus: CommandBus
  ) {}

  // Authenticate account command
  async authenticate(params: AuthenticateInput): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new AuthenticateCommand(params))
    return baseResponse(200, 'Conta autenticada com sucesso!', response)
  }

  // Forgot password command
  async forgotPassword(params: ForgotPasswordInput): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new ForgotPasswordCommand(params))
    return baseResponse(200, 'Um E-mail de recuperação de senha foi enviado para sua conta!', response)
  }

  // Reset password command
  async resetPassword(id: string, params: ResetPasswordInput): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new ResetPasswordCommand(id, params))
    return baseResponse(200, 'Sua senha foi recuperada com sucesso!', response)
  }
}
