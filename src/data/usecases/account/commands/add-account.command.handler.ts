// Dependencies
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

// Commands
import { AddAccountCommand } from '@/data/protocols'

// Repositories and Schemas
import { AccountRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account } from '@/domain/entities'

// Infra
import { SendGridService } from '@/infra/mail'
import { ApolloError } from 'apollo-server-express'

@CommandHandler(AddAccountCommand)
export class AddAccountHandler implements ICommandHandler<AddAccountCommand> {
  // Dependencies injection
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly messageService: SendGridService
  ) {}

  // Execute action handler
  async execute(command: AddAccountCommand): Promise<Account> {

    // Step 1. Create account
    const createdAccount = await this.createAccount(command)
    if (!createdAccount) throw new ApolloError(`Ocorreu um erro ao criar sua conta!`, '500')

    // Send confirmation E-mail
    const r = await this.messageService.sendTemplateMail({
      subject: 'Seja bem vindo ao playliter',
      to: createdAccount.email,
      template: 'd-c98dfaa8235540dba80afd569389acd5',
      context: {
        subject: 'Seja bem vindo ao playliter',
        name: createdAccount.name,
        verify_url: 'https://playliter.vercel.app'
      }
    })
    if (r.status.code !== 200) console.log('[mail was not send]', r)

    // Return created account
    return createdAccount
  }

  // Create account handler
  async createAccount(command: AddAccountCommand): Promise<Account> {
    const { params } = command
    return await this.accountRepository.save({ ...params })
  }
}