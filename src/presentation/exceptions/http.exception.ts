// Dependencies
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { baseResponse } from '@/domain/shared'

// General error filter
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {

  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest()
    const response = ctx.getResponse()

    // Retrieve http status
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR

    // Retrieve exception message
    const body: any = exception instanceof HttpException
      ? exception.getResponse()
      : exception

    // Log error on console
    this.logger.error(`Http status: ${status}, Error message: ${JSON.stringify(body)}`)

    // Response as JSON
    response.status(status).json(baseResponse(
      status,
      typeof body === 'string' ? body : 'Erro ao processar a requisição',
      {
        timestamp: new Date().toISOString(),
        path: request.url,
        error: typeof body.message === 'string' ? undefined : body.message
      }
    ))
  }
}
