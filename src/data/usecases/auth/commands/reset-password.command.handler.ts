// Dependencies
import { HttpException, HttpStatus } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

// Commands
import { ResetPasswordCommand } from '@/data/protocols'

// Repositories and Schemas
import { AuthRepository, AccountRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Auth } from '@/domain/entities'
  
@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler implements ICommandHandler<ResetPasswordCommand> {
  // Dependencies injection
  constructor(
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository,
    private readonly authRepository: AuthRepository
  ) {}

  // Execute action handler
  async execute(command: ResetPasswordCommand): Promise<Account> {

    // Step 1. Retrieve current account
    const myAccount = await this.retrieveAccount(command)
    if (!myAccount) throw new HttpException(
      'Conta não encontrada.',
      HttpStatus.NOT_FOUND
    )

    // Step 2. Retrieve account auth token
    const myAuth = await this.retrieveAuthentication(myAccount)
    if (!myAuth || !myAuth.resetPasswordToken) {
      throw new HttpException(
        'Nenhuma solicitação de recuperação de senha encontrada para essa conta.',
        HttpStatus.BAD_REQUEST
      )
    }

    // Step 3. Validade reset token
    if (myAuth.resetPasswordToken !== command.params.token) {
      throw new HttpException(
        'O token enviado é invalido, por favor solicite uma nova troca de senha!',
        HttpStatus.BAD_REQUEST
      )
    }

    // Step 4. Update account password
    const restoredAccount = await this.updatePassword(command, myAccount)
    if (!restoredAccount) throw new HttpException(
      'Ocorreu um erro ao recuperar sua conta, tente novamente mais tarde.',
      HttpStatus.INTERNAL_SERVER_ERROR
    )

    // Step 5. Update authentication tokens
    const updatedAuthentication = await this.updateResetPasswordToken(myAuth)
    if (!updatedAuthentication) throw new HttpException(
      'Ocorreu um erro ao atualizar suas credencias, tente novamente mais tarde.',
      HttpStatus.INTERNAL_SERVER_ERROR
    )
    
    // Final step. Return the updated account
    return restoredAccount
  }

  // Retrieve account
  async retrieveAccount(command: ResetPasswordCommand): Promise<Account> {
    const { accountId } = command
    const account = await this.accountRepository.findOne({ id: accountId })
    return account
  }

  // Retrieve authentication
  async retrieveAuthentication(account: Account): Promise<Auth> {
    const { id } = account
    const auth = this.authRepository.findOne({ account: id })
    return auth
  }

  // Update account password
  async updatePassword(command: ResetPasswordCommand, account: Account): Promise<Account> {
    const { params: { newPassword } } = command
    const updatedAccount = this.accountRepository.changePassword(newPassword, { id: account.id })
    return updatedAccount
  }

  // Update authentication token
  async updateResetPasswordToken(auth: Auth): Promise<Auth> {
    return await this.authRepository.updateResetPasswordToken(auth, '')
  }
}
