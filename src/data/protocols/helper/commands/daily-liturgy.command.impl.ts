// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Domain Protocols
import { DailyLiturgyInput } from '@/domain/protocols'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Daily liturgy command
export class DailyLiturgyCommand implements ICommand {
  constructor(
    public readonly params: DailyLiturgyInput,
    public readonly payload: TokenPayload
  ) {}
}
