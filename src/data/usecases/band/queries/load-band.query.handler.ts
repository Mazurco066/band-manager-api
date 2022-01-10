// Dependencies
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import { ApolloError } from 'apollo-server-express'

// Commands
import { LoadBandByIdQuery } from '@/data/protocols'

// Domain Entities
import { Band } from '@/domain/entities'

// Repositories
import { BandRepository } from 'infra/db/mongodb'

@QueryHandler(LoadBandByIdQuery)
export class LoadBandByIdHandler implements IQueryHandler<LoadBandByIdQuery> {
  // Dependencies injection
  constructor(
    private readonly accountRepository: BandRepository
  ) {}

  // Execute action handler
  async execute(command: LoadBandByIdQuery): Promise<Band> {

    // Step 1 - Search for band into database
    const band = await this.fetchBand(command)
    if (!band) throw new ApolloError(`Banda de id ${command.params.id} não foi encontrada!`, '404')

    // Returning
    return band
  }

  // Fetch band from database
  async fetchBand(command: LoadBandByIdQuery): Promise<Band | null> {
    const { params: { id } } = command
    const r = await this.accountRepository.findOnePopulated({ id })
    return r
  }
}
