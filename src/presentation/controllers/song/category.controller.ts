// Dependencies
import { Injectable, Controller, Body, Query, Param, Post, Get, Put, Delete } from '@nestjs/common'
import { CategoryService } from '../../services/song'
import { IBaseResponse } from '@/domain/shared'

// API Documentation
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

// Authorization
import { Roles, Role, JwtUserDecorator } from '@/main/decorators'
import { TokenPayload } from '@/data/protocols'

// Inputs
import {
  AddCategoryInput,
  UpdateCategoryInput,
  ListCategoriesInput
} from '@/domain/protocols'

@ApiTags('Categories V2')
@Controller('api/v2/categories')
@Injectable()
export class CategoryControllerV2 {
  // Dependencies Injection
  constructor(
    private readonly categoryService: CategoryService
  ) {}

  /**
   * List all categories from band
   * @param bandId - Band id 
   * @param params - Filter 
   * @param payload - Token payload
   * @returns - Base response containing categories
   */
  @Get('/get/:bandId')
  @Roles(Role.player, Role.master)
  @ApiOperation({
    summary: 'List categories',
    description: 'List categories from a band'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of categories.'
  })
  async categories(
    @Param('bandId') bandId: string,
    @Query() params: ListCategoriesInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.categoryService.listCategoriesV2(bandId, params, payload)
  }
}

@ApiTags('Categories')
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
  @ApiOperation({
    summary: 'Create category',
    description: 'Add a new category to band'
  })
  @ApiResponse({
    status: 201,
    description: 'Returns the created category.'
  })
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
  @ApiOperation({
    summary: 'Remove category',
    description: 'Remove a category from band'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the deleted category.'
  })
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
  @ApiOperation({
    summary: 'Update category',
    description: 'Update a category from band'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated category.'
  })
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
  @ApiOperation({
    summary: 'Get category',
    description: 'Get category by id'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the cateogry that matches the requested id.'
  })
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
  @ApiOperation({
    summary: 'List categories',
    description: 'List categories from a band'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of categories.'
  })
  async categories(
    @Param('bandId') bandId: string,
    @Query() params: ListCategoriesInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.categoryService.listCategories(bandId, params, payload)
  }
}
