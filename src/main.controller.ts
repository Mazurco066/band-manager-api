// Dependencies
import { Controller, Get, Res } from '@nestjs/common'

// API Documentation
import { ApiTags } from '@nestjs/swagger'

// Helpers
import { baseResponse } from '@/domain/shared'

// Auth
import { SkipAuth } from '@/main/decorators' 
import { readFileSync } from 'fs'
import { resolve } from 'path'

const pj = readFileSync(resolve(__dirname, '../package.json'), 'utf-8')
const { version } = JSON.parse(pj)

@ApiTags('Root')
@Controller('api/v1')
export class MainController {
  @Get()
  @SkipAuth()
  getVersion(@Res() res): void {
    res.status(200).send(
      baseResponse(200, `Playliter API - version ${version} - REST API`)
    )
  }
}
