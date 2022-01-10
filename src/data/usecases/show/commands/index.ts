import { AddShowHandler } from './add-show.command.handler'
import { LinkSongHandler } from './link-song.command.handler'
import { RemoveShowHandler } from './remove-show.command.handler'
import { UnlinkSongHandler } from './unlink-song.command.handler'
import { UpdateShowHandler } from './update-show.command.handler'

export const ShowCommandHandlers = [
  AddShowHandler,
  LinkSongHandler,
  RemoveShowHandler,
  UnlinkSongHandler,
  UpdateShowHandler
]
