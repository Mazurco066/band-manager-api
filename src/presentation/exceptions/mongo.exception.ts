// Dependencies
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import { MongoError } from 'mongodb'
import { baseResponse } from '@/domain/shared'

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest()
    const response = ctx.getResponse()

    // Retrieve http status
    const status = HttpStatus.BAD_REQUEST

    // Error stack
    const stack = {
      timestamp: new Date().toISOString(),
      path: request.url,
      error: `Code: ${exception.code}`
    }

    // TODO: Map mongo errors into the filter
    switch (exception.code) {
      // Unique value errors
      case 11000:
        const [key, value] = Object.entries({ ...exception }?.['keyValue'])?.[0]
        response.status(status).json(baseResponse(
          status,
          (key && value)
            ? `Campo '${key}' de valor '${value}' já está em uso!`
            : `Erro ao processar requisição!`,
          stack
        ))
    }
  }
}