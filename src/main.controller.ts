// Dependencies
import { Controller, Get, Res } from '@nestjs/common'

// API Documentation
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

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
  @ApiOperation({
    summary: 'Get API version',
    description: 'Returns the current API version.'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the current API version.'
  })
  getVersion(@Res() res): void {
    res.status(200).send(
      baseResponse(200, `Playliter API - version ${version} - REST API`)
    )
  }
}
