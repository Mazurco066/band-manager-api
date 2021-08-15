// Dependencies
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import { ApolloError } from 'apollo-server-express'

// Commands
import { LoadAccountByIdQuery } from '@/data/protocols'

// Domain Entities
import { Account } from '@/domain/entities'

// Domain Protocols
import { RoleEnum } from '@/domain/protocols'

// Repositories
import { AccountRepository } from 'infra/db/mongodb'

@QueryHandler(LoadAccountByIdQuery)
export class LoadAccountByIdHandler implements IQueryHandler<LoadAccountByIdQuery> {
  // Dependencies injection
  constructor(
    private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: LoadAccountByIdQuery): Promise<Account> {
    // Step 01 - Validate roles
    this.validateRole(command)

    // Step 2 - Search for account into database
    const account = await this.fetchAccount(command)
    if (!account) throw new ApolloError(`Conta de id ${command.params.id} não foi encontrada!`, '404')

    // Returning
    return account
  }

  // Validates if is user is master
  validateRole(command: LoadAccountByIdQuery) {
    const { params: { id }, payload: { role, account } } = command
    if (role === RoleEnum.player && id !== account) {
      throw new ApolloError(`Você não tem permissão como ${RoleEnum.player} para consultar dados de outra conta`)
    }
  }

  // Fetch account from database
  async fetchAccount(command: LoadAccountByIdQuery): Promise<Account | null> {
    const { params: { id } } = command
    const account = await this.accountRepository.findOne({ id })
    return account
  }
}
