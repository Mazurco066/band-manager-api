import { AddBandHandler } from './add-band.command.handler'
import { AddMemberHandler } from './add-member.command.handler'
import { PromoteMemberHandler } from './promote-member.command.handler'
import { RemoveMemberHandler } from './remove-member.command.hanlder'

export const BandCommandHandlers = [
  AddBandHandler,
  AddMemberHandler,
  PromoteMemberHandler,
  RemoveMemberHandler
]