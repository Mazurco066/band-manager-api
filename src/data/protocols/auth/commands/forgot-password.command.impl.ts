// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols
import { ForgotPasswordInput } from '@/domain/protocols'

// Forgot password command
export class ForgotPasswordCommand implements ICommand {
  constructor(
    public readonly params: ForgotPasswordInput
  ) {}
}
