// Dependencies
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ApolloError } from 'apollo-server-express'
import { options } from '@/main/config'

// Commands
import { ResendVerificationCommand } from '@/data/protocols'

// Repositories and Schemas
import { AccountRepository, VerificationRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, VerificationCode } from '@/domain/entities'

// Infra services
import { SendGridService } from '@/infra/mail'

@CommandHandler(ResendVerificationCommand)
export class ResendVerificationHandler implements ICommandHandler<ResendVerificationCommand> {
  // Dependencies injection
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly verificationRepository: VerificationRepository,
    private readonly messageService: SendGridService
  ) {}

  // Execute action handler
  async execute(command: ResendVerificationCommand): Promise<Account> {

    // Step 1. Retrieve user account
    const currentAccount = await this.retrieveAccount(command)
    if (!currentAccount) throw new ApolloError('Conta não encontrada!', '404')

    // Step 2. Retrieve account verification code
    const verificationCode = await this.retrieveCode(currentAccount)
    if (!verificationCode) throw new ApolloError('Nenhum código de verificação foi gerado para essa conta!', '400')

    // Step 3. Send confirmation E-mail
    const r = await this.messageService.sendTemplateMail({
      subject: 'Seja bem vindo ao playliter',
      to: currentAccount.email,
      template: 'd-c98dfaa8235540dba80afd569389acd5',
      context: {
        subject: 'Seja bem vindo ao playliter',
        name: currentAccount.name,
        verify_url: `${options.FRONTEND_URL}/verify/${verificationCode.code}`,
        verify_code: verificationCode.code
      }
    })
    if (r.status.code !== 200) console.log('[mail was not send]', r)

    // Return verified account
    return currentAccount
  }

  // Retrieve account
  async retrieveAccount (command: ResendVerificationCommand): Promise<Account> {
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
}
