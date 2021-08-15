// Dependencies
import { Catch, ConflictException, ExceptionFilter } from '@nestjs/common'
import { MongoError } from 'mongodb'

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError) {
    // TODO: Map mongo errors into the filter
    switch (exception.code) {
      // Unique value errors
      case 11000:
        const [key, value] = Object.entries({ ...exception }?.['keyValue'])?.[0]
        if (key && value) {
          throw new ConflictException(`${key} ${value} já está em uso`)
        } else {
          throw new ConflictException()
        }
    }
  }
}