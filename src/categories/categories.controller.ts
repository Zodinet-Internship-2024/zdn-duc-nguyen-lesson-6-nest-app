import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PermissionGuard } from 'src/auth/permission.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { Permissions } from 'src/auth/entities/permisson.decorator';
import { Permission } from 'src/auth/permisson/permisson';
@ApiBearerAuth()
@UseGuards(PermissionGuard)
@UseGuards(AuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Permissions(Permission.Write_Category)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }
  @Permissions(Permission.Read_Category)
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }
  @Permissions(Permission.Read_Category)
  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!id) {
      throw new HttpException('Id  be required', HttpStatus.NOT_FOUND);
    }
    return this.categoriesService.findOne(+id);
  }
  @Permissions(Permission.Update_Category)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    if (!id) {
      throw new HttpException('Id  be required', HttpStatus.NOT_FOUND);
    }
    return this.categoriesService.update(+id, updateCategoryDto);
  }
  @Permissions(Permission.Delete_Category)
  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!id) {
      throw new HttpException('Id required', HttpStatus.NOT_FOUND);
    }
    return this.categoriesService.remove(+id);
  }
}
