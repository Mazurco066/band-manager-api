import { AddObservationHandler  } from './add-observation.command.handler'
import { AddShowHandler } from './add-show.command.handler'
import { LinkSongHandler } from './link-song.command.handler'
import { RemoveObservationHandler } from './remove-observation.command.handler'
import { RemoveShowHandler } from './remove-show.command.handler'
import { ReorderShowHandler } from './reorder.command.handler'
import { UnlinkSongHandler } from './unlink-song.command.handler'
import { UpdateObservationHandler } from './update-observation.command.handler'
import { UpdateShowHandler } from './update-show.command.handler'

export const ShowCommandHandlers = [
  AddObservationHandler,
  AddShowHandler,
  LinkSongHandler,
  RemoveObservationHandler,
  RemoveShowHandler,
  ReorderShowHandler,
  UnlinkSongHandler,
  UpdateObservationHandler,
  UpdateShowHandler
]
