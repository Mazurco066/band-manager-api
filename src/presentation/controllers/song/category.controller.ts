// Dependencies
import { Injectable, Controller, Body, Query, Param, Post, Get, Put, Delete } from '@nestjs/common'
import { CategoryService } from '../../services/song'
import { IBaseResponse } from '@/domain/shared'

// Authorization
import { Roles, Role, JwtUserDecorator } from '@/main/decorators'
import { TokenPayload } from '@/data/protocols'

// Inputs
import {
  AddCategoryInput,
  UpdateCategoryInput,
  ListCategoriesInput
} from '@/domain/protocols'

@Controller('api/v1/categories')
@Injectable()
export class CategoryController {
  // Dependencies Injection
  constructor(
    private readonly categoryService: CategoryService
  ) {}

  /**
   * Add a category to a band
   * @param bandId - Band id
   * @param params - Category data
   * @param payload - Token payload
   * @returns - Base response containing category
   */
  @Post('/:bandId')
  @Roles(Role.player, Role.master)
  async addCategory(
    @Param('bandId') bandId: string,
    @Body() params: AddCategoryInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.categoryService.addCategory(bandId, params, payload)
  }

  /**
   * Deletes a category
   * @param id - Category id
   * @param payload - Token payload
   * @returns - Base response containing category
   */
  @Delete('/:id')
  @Roles(Role.player, Role.master)
  async removeCategory(
    @Param('id') id: string,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.categoryService.removeCategory(id, payload)
  }

  /**
   * Updates a category
   * @param id - Category id
   * @param params - Category data
   * @param payload - Token payload
   * @returns - Base response containing category
   */
  @Put('/:id')
  @Roles(Role.player, Role.master)
  async updateCategory(
    @Param('id') id: string,
    @Body() params: UpdateCategoryInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.categoryService.updateCategory(id, params, payload)
  }

  /**
   * Load category by id
   * @param id - Category id
   * @param bandId - Band id
   * @param payload - Token payload
   * @returns - Base response containing category
   */
  @Get('/get/:bandId/:id')
  @Roles(Role.player, Role.master)
  async loadCategory(
    @Param('id') id: string,
    @Param('bandId') bandId: string,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.categoryService.loadCategoryById(id, bandId, payload)
  }

  /**
   * List all categories from band
   * @param bandId - Band id 
   * @param params - Filter 
   * @param payload - Token payload
   * @returns - Base response containing categories
   */
  @Get('/get/:bandId')
  @Roles(Role.player, Role.master)
  async categories(
    @Param('bandId') bandId: string,
    @Query() params: ListCategoriesInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.categoryService.listCategories(bandId, params, payload)
  }
}
