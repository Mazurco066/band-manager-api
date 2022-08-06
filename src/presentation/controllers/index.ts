import { AccountController } from './account'
import { AuthController } from './auth'
import { BandController, InviteController } from './band'
import { HelperController } from './helper'
import { ShowController } from './show'
import { CategoryController, SongController } from './song'

export const AccountControllers = [ AccountController ]
export const AuthControllers = [ AuthController ]
export const BandControllers = [ BandController, InviteController ]
export const HelperControllers = [ HelperController ]
export const ShowControllers = [ ShowController ]
export const SongControllers = [ CategoryController, SongController ]
