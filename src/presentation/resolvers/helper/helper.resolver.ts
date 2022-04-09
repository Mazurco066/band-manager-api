// Dependencies
import { Injectable } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { Args, Mutation, Resolver } from '@nestjs/graphql'

// Types
import { ScrapSongInput, ScrapType } from '@/domain/protocols'

// Commands & Queries
import { ScrapSongCommand, TokenPayload } from '@/data/protocols'

// Authenticator
import { Roles, Role, GqlUserDecorator } from '@/main/decorators' 

@Resolver('Helper')
@Injectable()
export class HelperResolver {
  // Dependencies Injection
  constructor(
    private readonly commandBus: CommandBus
  ) {}

  /**
   * Scrap Song Resolver
   * @param params - Check ScrapSongInput for details
   */
  @Mutation(() => ScrapType)
  @Roles(Role.player, Role.master)
  async scrapSong(
    @Args(ScrapSongInput.name) params: ScrapSongInput,
    @GqlUserDecorator() payload: TokenPayload
  ): Promise<String> {
    return this.commandBus.execute(new ScrapSongCommand({ ...params }, payload))
  }
}
