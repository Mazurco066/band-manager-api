// Dependencies
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ApolloError } from 'apollo-server-express'

// Commands
import { RemoveCategoryCommand } from '@/data/protocols'

// Repositories and Schemas
import { BandRepository, AccountRepository, CategoryRepository, SongRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Band, Category, Song } from '@/domain/entities'

// Domain Protocols
import { RoleEnum } from '@/domain/protocols'

@CommandHandler(RemoveCategoryCommand)
export class RemoveCategoryHandler implements ICommandHandler<RemoveCategoryCommand> {
  // Dependencies injection
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly songRepository: SongRepository,
    @Inject('BandRepository') private readonly bandRepository: BandRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: RemoveCategoryCommand): Promise<Category> {
    // Destruct params
    const { params: { id }, payload: { account } } = command

    // Step 1 Retrieve current Account
    const currentAccount = await this.fetchAccount(account)
    if (!currentAccount) throw new ApolloError(`Conta de id ${account} não encontrada`)

    // Step 2 - Retrieve category
    const retrievedCategory = await this.fetchCategory(command)
    if (!retrievedCategory) throw new ApolloError(`Categoria de id ${id} não encontrada!`)

    // Step 3 - Retrieve band
    const currentBand = await this.fetchBand(retrievedCategory)
    if (!currentBand) throw new ApolloError(`Banda na qual a categoria está vinculada não foi encontrada!`)

    // Step 3 - Validate Role and membership
    this.validateRole(command, currentBand, currentAccount)

    // Validate if category is not in use
    const categorySongs = await this.fetchSongs(retrievedCategory)
    if (categorySongs.length >= 1) {
      throw new ApolloError(`Essa categoria esta sendo usada por 1 ou mais músicas. Remova as músicas antes de deletar a categoria!`)
    }

    // Step 4 - Add member to band
    const result = await this.removeCategory(command)
    if (!result) throw new ApolloError(`Erro ao remover categoria de id ${id}!`)
    return retrievedCategory
  }

  // Fetch account from database
  async fetchAccount(id: string): Promise<Account | null> {
    const account = await this.accountRepository.findOne({ id })
    return account
  }

  // Fetch category from database
  async fetchCategory(command: RemoveCategoryCommand): Promise<Category | null> {
    const { params: { id } } = command
    const r = await this.categoryRepository.findOne({ id })
    return r
  }

  // Fetch band from database
  async fetchBand(category: Category): Promise<Band | null> {
    const { band } = category
    const r = await this.bandRepository.findOne({ _id: band })
    return r
  }

  // Fetch category songs
  async fetchSongs(category: Category): Promise<Song[]> {
    const { _id } = category
    const songs = await this.songRepository.find({ category: _id.toString() })
    return songs
  }

  // Validates if is user is master
  validateRole(command: RemoveCategoryCommand, band: Band, account: Account): void {
    const { payload: { role } } = command
    const { owner, admins } = band
    if (
      role === RoleEnum.player &&
      account._id.toString() !== owner &&
      !admins.includes(account._id.toString())
    ) {
      throw new ApolloError(`Você não tem permissão como ${RoleEnum.player} para atualizar dados dessa categoria!`)
    }
  }

  // Removes data from category
  async removeCategory(command: RemoveCategoryCommand): Promise<boolean> {
    const { params: { id } } = command
    const r = await this.categoryRepository.delete({ id })
    return r
  }
}