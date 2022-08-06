// Dependencies
import { HttpException, HttpStatus } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { JwtService } from '@nestjs/jwt'
// Commands
import { AuthenticateCommand, TokenPayload } from '@/data/protocols'

// Repositories and Schemas
import { AuthRepository, AccountRepository } from '@/infra/db/mongodb'

// Domain Entities
import { Account } from '@/domain/entities'

// Domain Protocols
import { TokenType } from '@/domain/protocols'

// Adapters
import { BcryptAdapter } from '@/infra/criptography'

@CommandHandler(AuthenticateCommand)
export class AuthenticateHandler implements ICommandHandler<AuthenticateCommand> {
  // Dependencies injection
  constructor(
    private readonly authRepository: AuthRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository,
    private readonly jwtService: JwtService
  ) {}

  // Execute action handler
  async execute(command: AuthenticateCommand): Promise<TokenType> {

    // Verify account by email
    const account = await this.checkAccountByEmail(command)

    // Compare two passwords
    await this.checkPasswords(command, account)

    // Create token payload
    const payload: TokenPayload = {
      account: account.id,
      role: account.role
    }

    // Create user
    const token = await this.generateToken(account, payload)
    return { token }
  }

  // Check if account exists
  async checkAccountByEmail(command: AuthenticateCommand): Promise<Account> {
    const { params: { username } } = command
    const r = await this.accountRepository.findOne({ username })
    if (!r) throw new HttpException(
      'Esse usuário não pertence a nenhuma conta cadastrada',
      HttpStatus.NOT_FOUND
    )
    return r
  }

  // Compare if passwords match
  async checkPasswords(command: AuthenticateCommand, account: Account): Promise<void> {
    const { params: { password } }  = command
    const encrypter = new BcryptAdapter()
    const pwdCompare = await encrypter.compare(password, account.password)
    if (!pwdCompare) throw new HttpException(
      'E-mail ou senha incorreto(s)',
      HttpStatus.UNAUTHORIZED
    )
  }

  // Generates a Token
  async generateToken(account: Account, payload: TokenPayload): Promise<string> {
    const currentToken = await this.authRepository.findOne({ account: account.id })
    const token = this.jwtService.sign(payload)
    const r = currentToken
      ? await this.authRepository.updateToken(account, token)
      : await this.authRepository.generateToken(account, token)
    return r.token
  }
}