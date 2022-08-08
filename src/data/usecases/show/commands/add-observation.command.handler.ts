// Dependencies
import { HttpException, HttpStatus, Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UniqueEntityID } from '@/domain/shared'

// Commands
import { AddObservationCommand } from '@/data/protocols'

// Repositories and Schemas
import { AccountRepository, ShowRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, Show } from '@/domain/entities'

@CommandHandler(AddObservationCommand)
export class AddObservationHandler implements ICommandHandler<AddObservationCommand> {
  // Dependencies injection
  constructor(
    private readonly showRepository: ShowRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository
  ) {}

  // Execute action handler
  async execute(command: AddObservationCommand): Promise<Show> {

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
      `Apresentação de id ${command.showId} não encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Create observation array
    const { params: { data, title } } = command
    const observation = {
      id: new UniqueEntityID().toValue(),
      title: title,
      data: data
    }
    const observations = show.observations ? [ ...show.observations, observation ] : [observation]

    // Save observation array to concert
    const updatedShow = await this.saveShow(command, observations)
    if (!updatedShow) throw new HttpException(
      'Ocorreu um erro interno ao atualizar a apresentação!',
      HttpStatus.INTERNAL_SERVER_ERROR
    )

    // Returning show
    return updatedShow
  }

  // Fetch account from database
  async fetchAccount(command: AddObservationCommand): Promise<Account | null> {
    const { payload: { account: id } } = command
    const account = await this.accountRepository.findOne({ id })
    return account
  }

  // Fetch show from database
  async fetchShow(command: AddObservationCommand): Promise<Show | null> {
    const { showId: id } = command
    const show = await this.showRepository.findOne({ id })
    return show
  }

  // Save show
  async saveShow(command: AddObservationCommand, observations: Array<any>): Promise<Show> {
    const { showId: id } = command
    const show = await this.showRepository.update({ observations }, id)
    return show
  }
}
