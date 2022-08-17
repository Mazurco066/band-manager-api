import { AccountService } from './account'
import { AuthService } from './auth'
import { BandService, InviteService } from './band'
import { HelperService } from './helper'
import { ShowService } from './show'
import { CategoryService, SongService } from './song'

export const AccountServices = [ AccountService ]
export const AuthServices = [ AuthService ]
export const BandServices = [ BandService, InviteService ]
export const HelperServices = [ HelperService ]
export const ShowServices = [ ShowService ]
export const SongServices = [ CategoryService, SongService ]
