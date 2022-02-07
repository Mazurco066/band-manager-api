// Dependencies
import { NestFactory } from '@nestjs/core'
import { Logger, ValidationPipe } from '@nestjs/common'
import { options } from 'main/config'

// Module
import { MainModule } from './main.module'

// Filters
import { MongoExceptionFilter } from './presentation/exceptions'

// Initialization
const app = async () => {
  try {

    // Create Nestjs app
    const app = await NestFactory.create(MainModule)

    // Class validator custom pipe
    const validationOptions = {
      skipMissingProperties: false,
      validationError: { target: false },
      validateCustomDecorators: true
    }

    // Add custom filters
    app.useGlobalPipes(new ValidationPipe(validationOptions))
    app.useGlobalFilters(new MongoExceptionFilter())

    // Start Application
    await app.listen(options.PORT)
    Logger.log(`App is listening at http://localhost:${options.PORT}`)

  } catch (error) {
    console.log(error)
  }
}
app()
