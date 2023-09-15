import { ListCategoriesHandler } from './list-categories.query.handler'
import { ListPublicSongsHandler } from './list-public-songs.query.handler'
import { LoadCategoryHandler } from './load-category.query.handler'
import { ListSongsbyCategoryHandler } from './list-songs-by-category.query.handler'
import { ListSongsHandler } from './list-songs.query.handler'
import { LoadSongHandler } from './load-song.query.handler'

export const SongQueriesHandlers = [
  ListCategoriesHandler,
  ListPublicSongsHandler,
  LoadCategoryHandler,
  ListSongsbyCategoryHandler,
  ListSongsHandler,
  LoadSongHandler
]