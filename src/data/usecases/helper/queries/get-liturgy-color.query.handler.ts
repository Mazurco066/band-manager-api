// Dependencies
import { HttpException, HttpStatus, Inject } from '@nestjs/common'
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'

// Dates json
import { calendar } from '@/assets/calendars/liturgy-calendar'

// Repositories and Schemas
import { ShowRepository, AccountRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Show } from '@/domain/entities'

// Queries
import { GetLiturgyColorQuery } from '@/data/protocols'

@QueryHandler(GetLiturgyColorQuery)
export class GetLiturgyColorHandler implements IQueryHandler<GetLiturgyColorQuery> {
  // Dependencies injection
  constructor(
    private readonly showRepository: ShowRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(query: GetLiturgyColorQuery): Promise<{ color: string }> {
    // Destruct params
    const { id, payload: { account } } = query

    // Step 1 - Retrieve account and show
    const [ currentAccount, currentShow ] = await Promise.all([
      this.fetchAccount(account),
      this.fetchShow(query)
    ])
    if (!currentAccount) throw new HttpException(
      `Conta de id ${account} não encontrada!`,
      HttpStatus.NOT_FOUND
    )
    if (!currentShow) throw new HttpException(
      `Apresentação de id ${id} não foi encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 2 -Retrieve liturgy color and return
    const { date } = currentShow
    const color = calendar[date.toISOString().split('T')[0]] || 'purple'
    return { color }
  }

  // Fetch account from database
  async fetchAccount(id: string): Promise<Account | null> {
    const r = await this.accountRepository.findOne({ id })
    return r
  }

  // Loads a song from band
  async fetchShow(query: GetLiturgyColorQuery): Promise<Show | null> {
    const { id } = query
    const r = await this.showRepository.findOnePopulated({ id })
    return r
  }
}
