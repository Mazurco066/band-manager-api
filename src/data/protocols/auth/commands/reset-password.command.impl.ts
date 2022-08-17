// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols
import { ResetPasswordInput } from '@/domain/protocols'

// Reset password command
export class ResetPasswordCommand implements ICommand {
  constructor(
    public readonly accountId: string,
    public readonly params: ResetPasswordInput
  ) {}
}

