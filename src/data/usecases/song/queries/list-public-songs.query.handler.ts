// Dependencies
import { HttpException, HttpStatus, Inject } from '@nestjs/common'
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'

// Commands
import { ListPublicSongsQuery } from '@/data/protocols'

// Repositories and Schemas
import { SongRepository, AccountRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Song } from '@/domain/entities'

@QueryHandler(ListPublicSongsQuery)
export class ListPublicSongsHandler implements IQueryHandler<ListPublicSongsQuery> {
  // Dependencies injection
  constructor(
    private readonly songRepository: SongRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: ListPublicSongsQuery): Promise<Song[]> {
    // Destruct params
    const { payload: { account } } = command

    // Step 1 - Retrieve current Account
    const currentAccount = await this.fetchAccount(account)
    if (!currentAccount) throw new HttpException(
      `Conta de id ${account} não encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 4 - Load songs from a band
    return await this.listSongs(command)
  }

  // Fetch account from database
  async fetchAccount(id: string): Promise<Account | null> {
    const r = await this.accountRepository.findOne({ id })
    return r
  }

  // Lists songs from a band
  async listSongs(command: ListPublicSongsQuery): Promise<Song[] | null> {
    const { params: { offset = 0, limit = 0, filter = '' } } = command
    const r = await this.songRepository.findPublicPopulated(filter, { offset, limit })
    return r
  }
}