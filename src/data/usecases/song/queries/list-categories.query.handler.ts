// Dependencies
import { HttpException, HttpStatus, Inject } from '@nestjs/common'
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'

// Commands
import { ListCategoriesQuery } from '@/data/protocols'

// Repositories and Schemas
import { BandRepository, CategoryRepository, AccountRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Band, Category } from '@/domain/entities'

// Domain Protocols
import { RoleEnum } from '@/domain/protocols'

@QueryHandler(ListCategoriesQuery)
export class ListCategoriesHandler implements IQueryHandler<ListCategoriesQuery> {
  // Dependencies injection
  constructor(
    private readonly categoryRepository: CategoryRepository,
    @Inject('BandRepository') private readonly bandRepository: BandRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: ListCategoriesQuery): Promise<Category[]> {
    // Destruct params
    const { bandId, payload: { account } } = command

    // Step 1 - Retrieve current Account
    const currentAccount = await this.fetchAccount(account)
    if (!currentAccount) throw new HttpException(
      `Conta de id ${account} não encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 2 - Retrieve band
    const currentBand = await this.fetchBand(bandId)
    if (!currentBand) throw new HttpException(
      `Banda de id ${bandId} não foi encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 3 - Validate Role and membership
    this.validateRole(command, currentBand, currentAccount)

    // Step 4 - Load categories from a band
    return await this.listCategories(command, currentBand)
  }

  // Fetch account from database
  async fetchAccount(id: string): Promise<Account | null> {
    const r = await this.accountRepository.findOne({ id })
    return r
  }

  // Fetch band from database
  async fetchBand(id: string): Promise<Band | null> {
    const r = await this.bandRepository.findOne({ id })
    return r
  }

  // Validates if is user is master
  validateRole(command: ListCategoriesQuery, band: Band, account: Account): void {
    const { payload: { role } } = command
    const { owner, members } = band
    if (
      role === RoleEnum.player &&
      account._id.toString() !== owner &&
      !members.includes(account._id.toString())
    ) {
      throw new HttpException(
        `Você não tem permissão como ${RoleEnum.player} para listar categorias dessa banda!`,
        HttpStatus.FORBIDDEN
      )
    }
  }

  // Lists categories from a band
  async listCategories(command: ListCategoriesQuery, band: Band): Promise<Category[] | null> {
    const { params: { offset = '0', limit = '0' } } = command
    const r = await this.categoryRepository.findPopulated(
      { band: band._id.toString() },
      { offset: parseInt(offset.toString()), limit: parseInt(limit.toString()) }
    )
    return r
  }
}
