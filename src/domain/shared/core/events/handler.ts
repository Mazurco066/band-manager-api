// Domain Event
import { IDomainEvent } from './domain-event'

export interface IHandle extends IDomainEvent {
  setupSubscriptions(): void
}
