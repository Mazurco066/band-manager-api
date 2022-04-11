import { AddBandHandler } from './add-band.command.handler'
import { AddMemberHandler } from './add-member.command.handler'
import { DemoteMemberHandler } from './demote-member.command.handler'
import { PromoteMemberHandler } from './promote-member.command.handler'
import { RemoveBandHandler } from './remove-band.command.handler' 
import { RemoveMemberHandler } from './remove-member.command.hanlder'
import { RespondInviteHandler } from './respond-invite.command.handler'
import { UpdateBandHandler } from './update-band.command.handler'

export const BandCommandHandlers = [
  AddBandHandler,
  AddMemberHandler,
  DemoteMemberHandler,
  PromoteMemberHandler,
  RemoveBandHandler,
  RemoveMemberHandler,
  RespondInviteHandler,
  UpdateBandHandler
]