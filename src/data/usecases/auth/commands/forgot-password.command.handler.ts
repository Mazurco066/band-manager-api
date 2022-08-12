// Dependencies
import { HttpException, HttpStatus } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { JwtService } from '@nestjs/jwt'
import { randomBytes } from 'crypto'
import { options } from '@/main/config'
import { IBaseResponse } from '@/domain/shared'

// Commands
import { ForgotPasswordCommand } from '@/data/protocols'

// Repositories and Schemas
import { AuthRepository, AccountRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Auth } from '@/domain/entities'
  
// Infra services
import { SendGridService } from '@/infra/mail'

@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordHandler implements ICommandHandler<ForgotPasswordCommand> {
  // Dependencies injection
  constructor(
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly messageService: SendGridService
  ) {}

  // Execute action handler
  async execute(command: ForgotPasswordCommand): Promise<{ token: string }> {

    // Step 1. Retrieve account by email
    const myAccount = await this.retrieveAccount(command)
    if (!myAccount) throw new HttpException(
      'O E-mail fornecido não corresponde a um a conta criada no aplicativo.',
      HttpStatus.NOT_FOUND
    )

    // Step 2. Generate a reset token
    const accountAuthentication = await this.retrieveAuthentication(myAccount)
    if (!accountAuthentication) throw new HttpException(
      'Ocorreu um erro ao gerar um código de recuperação para sua conta.',
      HttpStatus.INTERNAL_SERVER_ERROR
    )

    // Step 3. Send the reset URL to account E-mail
    const emailResponse = await this.notifyUser(myAccount, accountAuthentication)
    if (emailResponse.status.code !== 200) {
      throw new HttpException(
        'Ocorreu um erro ao enviar o E-mail de recuperação para sua conta.',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }

    // Final step. Return a message informing that a reset email was sent
    return { token: 'Um E-mail de recuperação foi enviado para sua conta!' }
  }

  // Retrieve account method
  async retrieveAccount(command: ForgotPasswordCommand): Promise<Account> {
    const { params: { email } } = command
    const account = await this.accountRepository.findOne({ email })
    return account
  }

  // Retrieve authentication
  async retrieveAuthentication(account: Account): Promise<Auth> {
    const { id } = account
    const currentToken = await this.authRepository.findOne({ account: id })
    const token = this.jwtService.sign({
      id: account.id,
      email: account.email,
      role: account.role
    })
    const resetPasswdToken = randomBytes(32).toString('hex')
    const r = currentToken
      ? await this.authRepository.updateResetPasswordToken(currentToken, resetPasswdToken)
      : await this.authRepository.generateResetPasswordToken(account, token, resetPasswdToken)
    return r
  }

  // Send E-mail
  async notifyUser(account: Account, auth: Auth): Promise<IBaseResponse> {
    const { email } = account
    const r =  await this.messageService.sendTemplateMail({
      subject: '[Playlityer] Recupere sua conta',
      to: email,
      template: 'd-6ed348edf26948baa5ed997302e9fa3f',
      context: {
        subject: '[Playlityer] Recupere sua conta',
        name: account.name,
        forgotUrl: `${options.FRONTEND_URL}/resetPassword/${account.id}/${auth.resetPasswordToken}`
      }
    })
    return r
  }
}
