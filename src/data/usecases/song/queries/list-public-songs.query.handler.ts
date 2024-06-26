// Dependencies
import { Inject } from '@nestjs/common'
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
  async execute(command: ListPublicSongsQuery): Promise<{
    limit: number,
    offset: number,
    total: number,
    data: Song[]
  }> {
    // Destruct params
    const {
      params: { limit = '0', offset = '0' },
    } = command

    // Step 1 - Load songs from a band
    const [ songs, total ] = await Promise.all([
      this.listSongs(command),
      this.countSongs(command)
    ])
  
    // Returning
    return {
      limit: Number(limit),
      offset: Number(offset),
      total,
      data: songs
    }
  }

  // Fetch account from database
  async fetchAccount(id: string): Promise<Account | null> {
    const r = await this.accountRepository.findOne({ id })
    return r
  }

  // Lists songs from a band
  async listSongs(command: ListPublicSongsQuery): Promise<Song[] | null> {
    const { params: { offset = '0', limit = '0', filter = '' } } = command
    const r = await this.songRepository.findPublicPopulated(filter, { offset: parseInt(offset.toString()), limit: parseInt(limit.toString()) })
    return r
  }

  // Count songs
  async countSongs(command: ListPublicSongsQuery): Promise<number> {
    const { params: { filter = '' } } = command
    return await this.songRepository.publicCount(filter)
  }
}