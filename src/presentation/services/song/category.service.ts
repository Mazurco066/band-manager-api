// Dependencies
import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { baseResponse, IBaseResponse } from '@/domain/shared'

// Inputs
import {
  AddCategoryInput,
  UpdateCategoryInput,
  ListCategoriesInput
} from '@/domain/protocols'

// Commands and queries
import {
  AddCategoryCommand,
  RemoveCategoryCommand,
  UpdateCategoryCommand,
  LoadCategoryQuery,
  ListCategoriesQuery,
  TokenPayload
} from '@/data/protocols'

@Injectable()
export class CategoryService {
  // Dependencies Injection
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  // Load category by id
  async loadCategoryById(id: string, bandId: string, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.queryBus.execute(new LoadCategoryQuery(id, bandId, payload))
    return baseResponse(200, 'Categoria recuperada com sucesso!', response)
  }

  // List Categories
  async listCategories(bandId: string, params: ListCategoriesInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.queryBus.execute(new ListCategoriesQuery(bandId, params, payload))
    return baseResponse(200, 'Categorias recuperadas com sucesso!', response)
  }

  // Add Category
  async addCategory(bandId: string, params: AddCategoryInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new AddCategoryCommand(bandId, params, payload))
    return baseResponse(201, 'Categoria salva com sucesso!', response)
  }

  // Update Category
  async updateCategory(id: string, params: UpdateCategoryInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new UpdateCategoryCommand(id, params, payload))
    return baseResponse(200, 'Categoria atualizada com sucesso!', response)
  }

  // Remove Category
  async removeCategory(id: string, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new RemoveCategoryCommand(id, payload))
    return baseResponse(200, 'Categoria removida com sucesso!', response)
  }
}
