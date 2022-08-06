// Dependencies
import { Injectable, Controller} from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'

@Controller('api/v1/helpers')
@Injectable()
export class HelperController {
  // Dependencies Injection
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

 
}
