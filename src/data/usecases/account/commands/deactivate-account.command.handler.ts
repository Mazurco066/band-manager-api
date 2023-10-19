// Dependencies
import { HttpException, HttpStatus } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

// Commands
import { DeactivateAccountCommand } from '@/data/protocols'

// Repositories and Schemas
import { AccountRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account } from '@/domain/entities'

// Domain Protocols
import { RoleEnum } from '@/domain/protocols'

@CommandHandler(DeactivateAccountCommand)
export class DeactivateAccountHandler implements ICommandHandler<DeactivateAccountCommand> {
  // Dependencies injection
  constructor(
    private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: DeactivateAccountCommand): Promise<Account> {
    // Step 01 - Validate roles
    this.validateRole(command)

    // Step 2 - Search for account into database
    const account = await this.fetchAccount(command)
    if (!account) throw new HttpException(
      `Conta de id ${command.id} não foi encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // TODO
    // Create endpoint to change band ownership
    // Remove user from bands

    // Step x - Deactivate account
    const deactivatedAccount = await this.disableAccount(command)

    // Final step - Return deleted account
    return deactivatedAccount
  }

  // Validates if is user is master
  validateRole(command: DeactivateAccountCommand) {
    const { id, payload: { role, account } } = command
    if (role === RoleEnum.player && id !== account) {
      throw new HttpException(
        `Você não tem permissão como ${RoleEnum.player} para remover dados de outra conta`,
        HttpStatus.FORBIDDEN
      )
    }
  }

  // Fetch account from database
  async fetchAccount(command: DeactivateAccountCommand): Promise<Account | null> {
    const { id } = command
    const account = await this.accountRepository.findOne({ id })
    return account
  }

  // Remove account from database
  async disableAccount(command: DeactivateAccountCommand): Promise<Account> {
    const { id } = command
    const r = await this.accountRepository.update({ isActive: false }, id)
    return r
  }
}