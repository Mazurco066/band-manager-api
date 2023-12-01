// Dependencies
import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

// Setup swagger function
export function initSwagger(app: INestApplication) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Playliter API')
    .setDescription('Rest API for playliter app')
    .setVersion('1.8.1')
    .build()
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api', app, document)
}