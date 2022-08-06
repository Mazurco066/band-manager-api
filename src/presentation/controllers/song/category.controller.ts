// Dependencies
import { Injectable, Controller} from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'

@Controller('api/v1/categories')
@Injectable()
export class CategoryController {
  // Dependencies Injection
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

 
}
