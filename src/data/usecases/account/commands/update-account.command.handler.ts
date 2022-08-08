// Dependencies
import { HttpException, HttpStatus } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { options } from '@/main/config'
import { generateVerificationCode } from '@/domain/shared'

// Commands
import { UpdateAccountCommand } from '@/data/protocols'

// Repositories and Schemas
import { AccountRepository, VerificationRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account, VerificationCode } from '@/domain/entities'

// Domain Protocols
import { RoleEnum } from '@/domain/protocols'

// Adapters
import { BcryptAdapter } from '@/infra/criptography'

// Infra services
import { SendGridService } from '@/infra/mail'

@CommandHandler(UpdateAccountCommand)
export class UpdateAccountHandler implements ICommandHandler<UpdateAccountCommand> {
  // Dependencies injection
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly verificationRepository: VerificationRepository,
    private readonly messageService: SendGridService
  ) {}

  // Execute action handler
  async execute(command: UpdateAccountCommand): Promise<Account> {
    // Step 01 - Validate roles
    this.validateRole(command)

    // Step 2 - Search for account into database
    const account = await this.fetchAccount(command)
    if (!account) throw new HttpException(
      `Conta de id ${command.id} não foi encontrada!`,
      HttpStatus.NOT_FOUND
    )

    // Step 3 - Verify if data was modified
    const proceed = this.verifyChanges(command, account)
    if (!proceed) throw new HttpException(
      `Nenhum dado foi modificado!`,
      HttpStatus.BAD_REQUEST
    )

    // Step 04 - Verify passwords if it has one
    const payload = await this.convertData(command, account)

    // Step 05 - Save changes
    return await this.updateAccount(command, payload)
  }

  // Validates if is user is master
  validateRole(command: UpdateAccountCommand) {
    const { id, payload: { role, account } } = command
    if (role === RoleEnum.player && id !== account) {
      throw new HttpException(
        `Você não tem permissão como ${RoleEnum.player} para atualizar dados de outra conta`,
        HttpStatus.FORBIDDEN
      )
    }
  }

  // Fetch account from database
  async fetchAccount(command: UpdateAccountCommand): Promise<Account | null> {
    const { id } = command
    const account = await this.accountRepository.findOne({ id })
    return account
  }

  // Verify if data was modified
  verifyChanges(command: UpdateAccountCommand, account: Account) : boolean {
    const { params: { avatar, email, name, password, oldPassword, confirmPassword } } = command
    if (
      name !== account.name ||
      email !== account.email ||
      avatar !== account.avatar ||
      (password && oldPassword && confirmPassword)
    ) return true
    return false
  }

  // Generate verification code for user
  async generateVerificationCode(account: Account): Promise<VerificationCode> {
    const { _id } = account
    const code = generateVerificationCode(4)
    return await this.verificationRepository.save({ code, account: _id })
  }

  // Convert data into schema
  async convertData(command: UpdateAccountCommand, account: Account): Promise<object> {
    const encrypter = new BcryptAdapter()
    const { params: { name, password, oldPassword, confirmPassword, avatar, email }, payload: { role } } = command
    let payload = { name, avatar }
    
    // Email updates
    if (email) {
      payload['email'] = email
      if (email !== account.email) {
        payload['isEmailconfirmed'] = false

        // Generate a new code to the account
        const accountCode = await this.generateVerificationCode(account)
        if (!accountCode) throw new HttpException(
          'Ocorreu um erro ao atualizar sua conta! Tente novamente mais tarde.',
          HttpStatus.INTERNAL_SERVER_ERROR
        )

        // Send confirmation E-mail
        const r = await this.messageService.sendTemplateMail({
          subject: '[Playliter] E-mail atualizado',
          to: email,
          template: 'd-378d91102d6141ba8bc7ad1fe909bfd0',
          context: {
            subject: '[Playliter] E-mail atualizado',
            name: account.name,
            verify_url: `${options.FRONTEND_URL}/verify/${accountCode.code}`,
            verify_code: accountCode.code
          }
        })
        if (r.status.code !== 200) console.log('[mail was not send]', r)
      }
    }

    // Updates the current password if informed
    if (oldPassword) {
      const pwdCompare = role === RoleEnum.master ? true : await encrypter.compare(oldPassword, account.password)
      if (!pwdCompare) throw new HttpException(
        'Senha atual informada não corresponde a armazenada',
        HttpStatus.BAD_REQUEST
      )
      if (password !== confirmPassword) throw new HttpException(
        'Nova senha e a confirmação informada não correspondem',
        HttpStatus.BAD_REQUEST
      )
      payload['password'] = password
    }

    // Return updated payload
    return payload
  }

  // Create account handler
  async updateAccount(command: UpdateAccountCommand, params: object): Promise<Account> {
    const { id } = command
    return await this.accountRepository.update({ ...params }, id)
  }
}