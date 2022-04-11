// Dependencies
import { IQuery } from '@nestjs/cqrs'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Pending invites Query
export class PendingInvitesQuery implements IQuery {
  constructor(
    public readonly payload: TokenPayload
  ) {}
}
