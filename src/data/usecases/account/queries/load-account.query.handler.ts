// Dependencies
import { HttpException, HttpStatus } from '@nestjs/common'
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'

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
    if (!account) throw new HttpException(
      `Conta de id ${command.id} não foi encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Returning
    return account
  }

  // Validates if is user is master
  validateRole(command: LoadAccountByIdQuery) {
    const { id, payload: { role, account } } = command
    if (role === RoleEnum.player && id !== account) {
      throw new HttpException(
        `Você não tem permissão como ${RoleEnum.player} para consultar dados de outra conta`,
        HttpStatus.FORBIDDEN
      )
    }
  }

  // Fetch account from database
  async fetchAccount(command: LoadAccountByIdQuery): Promise<Account | null> {
    const { id } = command
    const account = await this.accountRepository.findOne({ id })
    return account
  }
}
