import { AccountService } from './account'
import { AuthService } from './auth'
import { BandService, InviteService } from './band'
import { HelperService } from './helper'

export const AccountServices = [ AccountService ]
export const AuthServices = [ AuthService ]
export const BandServices = [ BandService, InviteService ]
export const HelperServices = [ HelperService ]
