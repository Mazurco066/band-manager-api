// Dependencies
import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

// Types
import {
  AddCategoryInput,
  RemoveCategoryByIdInput,
  UpdateCategoryInput,
  LoadCategoryByIdInput,
  ListCategoriesInput,
  BaseCategoryType,
  CategoryType
} from '@/domain/protocols'

// Commands & Queries
import {
  AddCategoryCommand,
  RemoveCategoryCommand,
  UpdateCategoryCommand,
  LoadCategoryQuery,
  ListCategoriesQuery,
  TokenPayload
} from '@/data/protocols'

// Authenticator
import { Roles, Role, GqlUserDecorator } from '@/main/decorators' 

// Schemas
import { Category } from '@/domain/entities'

@Resolver('Categories')
@Injectable()
export class CategoryResolver {
  // Dependencies Injection
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  /**
   * Create Category Resolver
   * @param params - Check AddCategoryInput for details
   */
  @Mutation(() => BaseCategoryType)
  @Roles(Role.player, Role.master)
  async addCategory(
    @Args(AddCategoryInput.name) params: AddCategoryInput,
    @GqlUserDecorator() payload: TokenPayload
  ): Promise<Category> {
    return this.commandBus.execute(new AddCategoryCommand({ ...params }, payload))
  }

  /**
   * Remove Category Resolver
   * @param params - Check RemoveCategoryByIdInput for details
   */
  @Mutation(() => BaseCategoryType)
  @Roles(Role.player, Role.master)
  async removeCategory(
    @Args(RemoveCategoryByIdInput.name) params: RemoveCategoryByIdInput,
    @GqlUserDecorator() payload: TokenPayload
  ): Promise<Category> {
    return this.commandBus.execute(new RemoveCategoryCommand({ ...params }, payload))
  }

  /**
   * Update Category Resolver
   * @param params - Check UpdateCategoryInput for details
   */
  @Mutation(() => BaseCategoryType)
  @Roles(Role.player, Role.master)
  async updateCategory(
    @Args(UpdateCategoryInput.name) params: UpdateCategoryInput,
    @GqlUserDecorator() payload: TokenPayload
  ): Promise<Category> {
    return this.commandBus.execute(new UpdateCategoryCommand({ ...params }, payload))
  }

  /**
   * Loads a category from a band
   * @param params - Check LoadCategoryByIdInput for details
   */
  @Query(() => CategoryType)
  @Roles(Role.player, Role.master)
  async category(
    @Args(LoadCategoryByIdInput.name) params: LoadCategoryByIdInput,
    @GqlUserDecorator() payload: TokenPayload
  ): Promise<Category> {
    return this.queryBus.execute(new LoadCategoryQuery({ ...params }, payload))
  }
 
  /**
   * Loads categories from a band
   * @param params - Check ListCategoriesInput for details
   */
  @Query(() => [CategoryType])
  @Roles(Role.player, Role.master)
  async categories(
    @Args(ListCategoriesInput.name) params: ListCategoriesInput,
    @GqlUserDecorator() payload: TokenPayload
  ): Promise<Category[]> {
    return this.queryBus.execute(new ListCategoriesQuery({ ...params }, payload))
  }
}
