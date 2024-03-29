// Dependencies
import { HttpException, HttpStatus } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

// Commands
import { VerifyAccountCommand } from '@/data/protocols'

// Repositories and Schemas
import { AccountRepository, VerificationRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, VerificationCode } from '@/domain/entities'

@CommandHandler(VerifyAccountCommand)
export class VerifyAccountHandler implements ICommandHandler<VerifyAccountCommand> {
  // Dependencies injection
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly verificationRepository: VerificationRepository
  ) {}

  // Execute action handler
  async execute(command: VerifyAccountCommand): Promise<Account> {

    // Step 1. Retrieve user account
    const currentAccount = await this.retrieveAccount(command)
    if (!currentAccount) throw new HttpException(
      'Conta não encontrada!',
      HttpStatus.NOT_FOUND
    )

    // Step 2. Retrieve account verification code
    const verificationCode = await this.retrieveCode(currentAccount)
    if (!verificationCode) throw new HttpException(
      'Nenhum código de verificação foi gerado para essa conta!',
      HttpStatus.BAD_REQUEST
    )

    // Step 3. Match codes
    const isCodeEquals = this.verifyCode(command, verificationCode)
    if (!isCodeEquals) throw new HttpException(
      'Código de verificação informado não corresponde ao gerado.',
      HttpStatus.BAD_REQUEST
    )

    // Step 4. Added verified status to account
    const verifiedAccount = await this.addVerifyStatusToAccount(currentAccount)
    if (!verifiedAccount) throw new HttpException(
      'Erro ao confirmar o e-mail de sua conta! Tente novamente mais tarde.',
      HttpStatus.INTERNAL_SERVER_ERROR
    )

    // Return verified account
    return verifiedAccount
  }

  // Retrieve account
  async retrieveAccount (command: VerifyAccountCommand): Promise<Account> {
    const { payload: { account: id } } = command
    const account = await this.accountRepository.findOne({ id })
    return account
  }

  // Retrive verification code
  async retrieveCode (account: Account): Promise<VerificationCode> {
    const { _id: id } = account
    const verification = await this.verificationRepository.findOne({ account: id.toString() })
    return verification
  }

  // Validate if user code matches the generated one
  verifyCode(command: VerifyAccountCommand, verificationCode: VerificationCode): boolean {
    const { params: { code } } = command
    const { code: remoteCode } = verificationCode
    return code === remoteCode
  }

  // Verify account
  async addVerifyStatusToAccount(account: Account): Promise<Account> {
    const { id } = account
    const updatedAccount = await this.accountRepository.update({ isEmailconfirmed: true }, id)
    return updatedAccount
  }
}
