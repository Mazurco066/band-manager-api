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

  @Post('/:bandId')
  @Roles(Role.player, Role.master)
  async addCategory(
    @Param('bandId') bandId: string,
    @Body() params: AddCategoryInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.categoryService.addCategory(bandId, params, payload)
  }

  @Delete('/:id')
  @Roles(Role.player, Role.master)
  async removeCategory(
    @Param('id') id: string,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.categoryService.removeCategory(id, payload)
  }

  @Put('/:id')
  @Roles(Role.player, Role.master)
  async updateCategory(
    @Param('id') id: string,
    @Body() params: UpdateCategoryInput,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.categoryService.updateCategory(id, params, payload)
  }

  @Get('/get/:bandId/:id')
  @Roles(Role.player, Role.master)
  async loadCategory(
    @Param('id') id: string,
    @Param('bandId') bandId: string,
    @JwtUserDecorator() payload: TokenPayload
  ): Promise<IBaseResponse> {
    return this.categoryService.loadCategoryById(id, bandId, payload)
  }

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
