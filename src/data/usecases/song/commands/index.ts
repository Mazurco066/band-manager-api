// Song
import { AddSongHandler } from './add-song.command.handler'
import { RemoveSongHandler } from './remove-song.command.handler'
import { UpdateSongHandler } from './update-song.command.handler'

// Category
import { AddCategoryHandler } from './add-category.command.handler'
import { RemoveCategoryHandler } from './remove-category.command.hamdler'
import { UpdateCategoryHandler } from './update-category.command.handler'

export const SongCommandHandlers = [
  AddSongHandler,
  RemoveSongHandler,
  UpdateSongHandler,
  AddCategoryHandler,
  RemoveCategoryHandler,
  UpdateCategoryHandler
]