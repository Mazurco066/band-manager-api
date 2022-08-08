// Dependencies
import { HttpException, HttpStatus, Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

// Commands
import { AddCategoryCommand } from '@/data/protocols'

// Repositories and Schemas
import { BandRepository, AccountRepository, CategoryRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Band, Category } from '@/domain/entities'

// Domain Protocols
import { RoleEnum } from '@/domain/protocols'

@CommandHandler(AddCategoryCommand)
export class AddCategoryHandler implements ICommandHandler<AddCategoryCommand> {
  // Dependencies injection
  constructor(
    private readonly categoryRepository: CategoryRepository,
    @Inject('BandRepository') private readonly bandRepository: BandRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: AddCategoryCommand): Promise<Category> {
    // Destruct params
    const { bandId } = command

    // Step 1 - Get authenticated account
    const account = await this.fetchAccount(command)
    if (!account) throw new HttpException(
      `Conta de id ${command.payload.account} não foi encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 2 - Get desired band
    const band = await this.fetchBand(command)
    if (!band) throw new HttpException(
      `Banda de id ${bandId} não encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 3 - Validate if user is able to create category
    this.validateRole(command, band, account)

    // Step 4 - Create category
    return await this.createCategory(command, band)
  }

  // Fetch account from database
  async fetchAccount(command: AddCategoryCommand): Promise<Account | null> {
    const { payload: { account: id } } = command
    const account = await this.accountRepository.findOne({ id })
    return account
  }

  // Fetch band from database
  async fetchBand(command: AddCategoryCommand): Promise<Band | null> {
    const { bandId } = command
    const r = await this.bandRepository.findOne({ id: bandId })
    return r
  }

  // Validates if is user is master
  validateRole(command: AddCategoryCommand, band: Band, account: Account): void {
    const { payload: { role } } = command
    const { owner, admins } = band
    if (
      role === RoleEnum.player &&
      account._id.toString() !== owner &&
      !admins.includes(account._id.toString())
    ) {
      throw new HttpException(
        `Você não tem permissão como ${RoleEnum.player} para criar uma categoria!`,
        HttpStatus.FORBIDDEN
      )
    }
  }

  // Creates category into database
  async createCategory(command: AddCategoryCommand, band: Band): Promise<Category | null> {
    const { _id  } = band
    const { params } = command
    const r = await this.categoryRepository.save({ 
      ...params, 
      band: _id.toString()
    })
    return r
  }
}