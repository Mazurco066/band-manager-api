/*
 _____                                           _____  _____  _____  _____ 
|  __ \                                         / __  \|  _  |/ __  \/ __  \
| |  \/_ __ ___   __ _ _____   _ _ __ ___ ___   `' / /'| |/' |`' / /'`' / /'
| | __| '_ ` _ \ / _` |_  / | | | '__/ __/ _ \    / /  |  /| |  / /    / /  
| |_\ \ | | | | | (_| |/ /| |_| | | | (_| (_) | ./ /___\ |_/ /./ /___./ /___
 \____/_| |_| |_|\__,_/___|\__,_|_|  \___\___/  \_____/ \___/ \_____/\_____/

 Firebase deploy script
*/

// Dependencies
import { NestFactory } from '@nestjs/core'
import { Logger, ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

// Firebase tools and express server
import express from 'express'
import { ExpressAdapter } from '@nestjs/platform-express'
import * as functions from 'firebase-functions'

// Retrieve express instance
const expressServer = express()

// Module
import { MainModule } from './main.module'

// Filters
import { HttpExceptionFilter, MongoExceptionFilter } from './presentation/exceptions'

// Initialization
const createFunction  = async (expressInstance: any): Promise<void> => {
  try {

    // Create Nestjs app
    const app = await NestFactory.create(
      MainModule,
      new ExpressAdapter(expressInstance)
    )

    // Enable server CORS
    app.enableCors({
      origin: '*',
      methods: '*',
      allowedHeaders: '*',
      credentials: true
    })

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
      .setVersion('1.5.0')
      .build()
    const document = SwaggerModule.createDocument(app, swaggerConfig)
    SwaggerModule.setup('api', app, document)

    // Start Application
    await app.init()

  } catch (error) {
    Logger.error(`Error: ${JSON.stringify(error)}`)
  }
}

// Start server
export const api = functions.https.onRequest(async (request, response) => {
  await createFunction(expressServer)
  expressServer(request, response)
});
