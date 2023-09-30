// Dependencies
import { ICommand } from '@nestjs/cqrs'

// Data Protocols
import { TokenPayload } from '@/data/protocols'

// Scrap song command
export class UploadFileCommand implements ICommand {
  constructor(
    public readonly file: Express.Multer.File,
    public readonly payload: TokenPayload
  ) {}
}