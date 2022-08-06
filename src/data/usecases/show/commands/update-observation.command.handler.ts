// Dependencies
import { HttpException, HttpStatus, Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

// Commands
import { UpdateObservationCommand } from '@/data/protocols'

// Repositories and Schemas
import { AccountRepository, ShowRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Show } from '@/domain/entities'

@CommandHandler(UpdateObservationCommand)
export class UpdateObservationHandler implements ICommandHandler<UpdateObservationCommand> {
  // Dependencies injection
  constructor(
    private readonly showRepository: ShowRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: UpdateObservationCommand): Promise<Show> {

    // Retrieve account and show
    const [ account, show ] = await Promise.all([
      this.fetchAccount(command),
      this.fetchShow(command)
    ])
    if (!account) throw new HttpException(
      `Conta de id ${command.payload.account} não foi encontrada!`,
      HttpStatus.NOT_FOUND
    )
    if (!show) throw new HttpException(
      `Apresentação de id ${command.params.show} não encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Verify if observation is present
    const { params: { id, title, data } } = command
    const observations = show.observations ? [ ...show.observations ] : []
    const currentObservation = observations.find(obs => obs.id === id)
    if (!currentObservation) throw new HttpException(
      `Observação de id ${id} não encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Update observation data
    const updatedObservations = observations.map(obs => {
      return (obs.id !== id)
        ? { ...obs }
        : { ...obs, title, data }
    })

    // Save observation array to concert
    const updatedShow = await this.saveShow(command, updatedObservations)
    if (!updatedShow) throw new HttpException(
      'Ocorreu um erro interno ao atualizar a apresentação!',
      HttpStatus.INTERNAL_SERVER_ERROR
    )

    // Returning show
    return updatedShow
  }

  // Fetch account from database
  async fetchAccount(command: UpdateObservationCommand): Promise<Account | null> {
    const { payload: { account: id } } = command
    const account = await this.accountRepository.findOne({ id })
    return account
  }

  // Fetch show from database
  async fetchShow(command: UpdateObservationCommand): Promise<Show | null> {
    const { params: { show: id } } = command
    const show = await this.showRepository.findOne({ id })
    return show
  }

  // Save show
  async saveShow(command: UpdateObservationCommand, observations: Array<any>): Promise<Show> {
    const { params: { show: id } } = command
    const show = await this.showRepository.update({ observations }, id)
    return show
  }
}
