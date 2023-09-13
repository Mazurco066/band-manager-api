import { AccountController } from './account'
import { AuthController } from './auth'
import { BandController, InviteController } from './band'
import { HelperController } from './helper'
import { ShowController, ShowControllerV2 } from './show'
import { CategoryController, CategoryControllerV2, SongController } from './song'

export const AccountControllers = [ AccountController ]
export const AuthControllers = [ AuthController ]
export const BandControllers = [ BandController, InviteController ]
export const HelperControllers = [ HelperController ]
export const ShowControllers = [ ShowController, ShowControllerV2 ]
export const SongControllers = [ CategoryController, CategoryControllerV2, SongController ]
