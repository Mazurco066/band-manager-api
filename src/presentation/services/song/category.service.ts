// Dependencies
import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { baseResponse, IBaseResponse, sanitizeJson } from '@/domain/shared'

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

// Default class omits
const categoryOmitKeys = [
  '_id',
  '__v',
  'band._id',
  'band.__v',
  'band.admins',
  'band.directory',
  'band.members'
]

const categoryMutationOmitKeys = [
  '_id',
  '__v',
  'band'
]

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
    const safeResponse = sanitizeJson(response, categoryOmitKeys)
    return baseResponse(200, 'Categoria recuperada com sucesso!', safeResponse)
  }

  // List Categories
  async listCategories(bandId: string, params: ListCategoriesInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.queryBus.execute(new ListCategoriesQuery(bandId, params, payload))
    const safeResponse = sanitizeJson(response, categoryOmitKeys)
    return baseResponse(200, 'Categorias recuperadas com sucesso!', safeResponse)
  }

  // Add Category
  async addCategory(bandId: string, params: AddCategoryInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new AddCategoryCommand(bandId, params, payload))
    const safeResponse = sanitizeJson(response, categoryMutationOmitKeys)
    return baseResponse(201, 'Categoria salva com sucesso!', safeResponse)
  }

  // Update Category
  async updateCategory(id: string, params: UpdateCategoryInput, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new UpdateCategoryCommand(id, params, payload))
    const safeResponse = sanitizeJson(response, categoryMutationOmitKeys)
    return baseResponse(200, 'Categoria atualizada com sucesso!', safeResponse)
  }

  // Remove Category
  async removeCategory(id: string, payload: TokenPayload): Promise<IBaseResponse> {
    const response = await this.commandBus.execute(new RemoveCategoryCommand(id, payload))
    const safeResponse = sanitizeJson(response, categoryMutationOmitKeys)
    return baseResponse(200, 'Categoria removida com sucesso!', safeResponse)
  }
}
