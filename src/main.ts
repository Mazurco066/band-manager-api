/*
 _____                                           _____  _____  _____  _____ 
|  __ \                                         / __  \|  _  |/ __  \/ __  \
| |  \/_ __ ___   __ _ _____   _ _ __ ___ ___   `' / /'| |/' |`' / /'`' / /'
| | __| '_ ` _ \ / _` |_  / | | | '__/ __/ _ \    / /  |  /| |  / /    / /  
| |_\ \ | | | | | (_| |/ /| |_| | | | (_| (_) | ./ /___\ |_/ /./ /___./ /___
 \____/_| |_| |_|\__,_/___|\__,_|_|  \___\___/  \_____/ \___/ \_____/\_____/
*/

// Dependencies
import { NestFactory } from '@nestjs/core'
import { Logger, ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { options } from 'main/config'

// Module
import { MainModule } from './main.module'

// Filters
import { HttpExceptionFilter, MongoExceptionFilter } from './presentation/exceptions'

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
    app.useGlobalFilters(
      new HttpExceptionFilter(),
      new MongoExceptionFilter()
    )

    // Swagger init
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Playliter API')
      .setDescription('Rest API for playliter app')
      .setVersion('1.4.0')
      .build()
    const document = SwaggerModule.createDocument(app, swaggerConfig)
    SwaggerModule.setup('api', app, document)

    // Start Application
    await app.listen(options.PORT)
    Logger.log(`App is listening at http://localhost:${options.PORT}`)

  } catch (error) {
    console.log(error)
  }
}
app()
