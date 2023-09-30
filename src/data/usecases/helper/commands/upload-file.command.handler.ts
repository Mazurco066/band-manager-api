// Dependencies
import toStream from 'buffer-to-stream'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary'

// Commands
import { UploadFileCommand } from '@/data/protocols'

@CommandHandler(UploadFileCommand)
export class UploadFileHandler implements ICommandHandler<UploadFileCommand> {
  // Dependencies injection
  constructor() {}

  // Execute action handler
  async execute(command: UploadFileCommand): Promise<{ uri: string | null }> {
    // Destruct params
    const { file } = command

    // Trying to upload image
    try {
      const result = await this.uploadToCloudinary(file.buffer)
      return { uri: result.secure_url }
    } catch (error) {
      console.error(error)
      return { uri: null }
    }
  }

  // Cloudinary upload function
  async uploadToCloudinary(buffer: any): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream((error, result) => {
        if (error) return reject(error)
        resolve(result)
      })
      toStream(buffer).pipe(upload)
    })
  }
}
