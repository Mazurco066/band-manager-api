// Dependencies
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ApolloError } from 'apollo-server-express'

// Commands
import { RemoveObservationCommand } from '@/data/protocols'

// Repositories and Schemas
import { AccountRepository, ShowRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Show } from '@/domain/entities'

@CommandHandler(RemoveObservationCommand)
export class RemoveObservationHandler implements ICommandHandler<RemoveObservationCommand> {
  // Dependencies injection
  constructor(
    private readonly showRepository: ShowRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: RemoveObservationCommand): Promise<Show> {

    // Retrieve account and show
    const [ account, show ] = await Promise.all([
      this.fetchAccount(command),
      this.fetchShow(command)
    ])
    if (!account) throw new ApolloError(`Conta de id ${command.payload.account} não foi encontrada!`, '404')
    if (!show) throw new ApolloError(`Apresentação de id ${command.params.show} não encontrada!`, '404')

    // Verify if observation is present
    const { params: { id } } = command
    const observations = show.observations ? [ ...show.observations ] : []
    const currentObservation = observations.find(obs => obs.id === id)
    if (!currentObservation) throw new ApolloError(`Observação de id ${id} não encontrada!`, '404')

    // Remove observation data
    const updatedObservations = observations.filter(obs => obs.id !== id)

    // Save observation array to concert
    const updatedShow = await this.saveShow(command, updatedObservations)
    if (!updatedShow) throw new ApolloError('Ocorreu um erro interno ao atualizar a apresentação!', '500')

    // Returning show
    return updatedShow
  }

  // Fetch account from database
  async fetchAccount(command: RemoveObservationCommand): Promise<Account | null> {
    const { payload: { account: id } } = command
    const account = await this.accountRepository.findOne({ id })
    return account
  }

  // Fetch show from database
  async fetchShow(command: RemoveObservationCommand): Promise<Show | null> {
    const { params: { show: id } } = command
    const show = await this.showRepository.findOne({ id })
    return show
  }

  // Save show
  async saveShow(command: RemoveObservationCommand, observations: Array<any>): Promise<Show> {
    const { params: { show: id } } = command
    const show = await this.showRepository.update({ observations }, id)
    return show
  }
}
