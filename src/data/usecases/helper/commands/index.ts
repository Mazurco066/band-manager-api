import { DailyLiturgyHandler } from './daily-liturgy.command.handler'
import { ScrapSongHandler } from './scrap-song.command.handler'
import { UploadFileHandler } from './upload-file.command.handler'

export const HelperCommandHandlers = [
  DailyLiturgyHandler,
  ScrapSongHandler,
  UploadFileHandler
]
