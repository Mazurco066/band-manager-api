import { AccountResolver } from './account'
import { AuthResolver } from './auth'
import { BandResolver } from './band'
import { ShowResolver } from './show'
import { CategoryResolver, SongResolver } from './song'

export const AccountResolvers = [ AccountResolver ]
export const AuthResolvers = [ AuthResolver ]
export const BandResolvers = [ BandResolver ]
export const ShowResolvers = [ ShowResolver ]
export const SongResolvers = [ CategoryResolver, SongResolver ]
