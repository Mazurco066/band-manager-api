// Dependencies
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'

// Queries
import { IsServiceAvailableQuery } from '@/data/protocols'

@QueryHandler(IsServiceAvailableQuery)
export class IsServiceAvailableHandler implements IQueryHandler<IsServiceAvailableQuery> {
  // Dependencies injection
  constructor() {}

  // Execute action handler
  async execute(_: IsServiceAvailableQuery): Promise<{ status: string }> {
    return {
      status: 'ok'
    }
  }
}
