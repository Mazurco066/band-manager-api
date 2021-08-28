import { AddSongHandler } from './add-song.command.handler'
import { RemoveSongHandler } from './remove-song.command.handler'
import { UpdateSongHandler } from './update-song.command.handler'

export const SongCommandHandlers = [
  AddSongHandler,
  RemoveSongHandler,
  UpdateSongHandler
]