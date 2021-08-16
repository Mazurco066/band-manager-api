// Dependencies
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ApolloError } from 'apollo-server-express'

// Commands
import { RemoveAccountCommand } from '@/data/protocols'

// Repositories and Schemas
import { AccountRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account } from '@/domain/entities'

// Domain Protocols
import { RoleEnum } from '@/domain/protocols'

@CommandHandler(RemoveAccountCommand)
export class RemoveAccountHandler implements ICommandHandler<RemoveAccountCommand> {
  // Dependencies injection
  constructor(
    private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: RemoveAccountCommand): Promise<Account> {
    // Step 01 - Validate roles
    this.validateRole(command)

    // Step 2 - Search for account into database
    const account = await this.fetchAccount(command)
    if (!account) throw new ApolloError(`Conta de id ${command.params.id} não foi encontrada!`, '404')

    // Step 3 - Remove account
    const isDeleted = await this.removeAccount(command)
    if (!isDeleted) throw new ApolloError('Erro ao remover a conta! Por favor tente novamente mais tarde.')

    // Step 4 - Return deleted account
    return account
  }

  // Validates if is user is master
  validateRole(command: RemoveAccountCommand) {
    const { params: { id }, payload: { role, account } } = command
    if (role === RoleEnum.player && id !== account) {
      throw new ApolloError(`Você não tem permissão como ${RoleEnum.player} para remover dados de outra conta`)
    }
  }

  // Fetch account from database
  async fetchAccount(command: RemoveAccountCommand): Promise<Account | null> {
    const { params: { id } } = command
    const account = await this.accountRepository.findOne({ id })
    return account
  }

  // Remove account from database
  async removeAccount(command: RemoveAccountCommand): Promise<boolean> {
    const { params: { id } } = command
    const r = await this.accountRepository.delete({ id })
    return r
  }
}