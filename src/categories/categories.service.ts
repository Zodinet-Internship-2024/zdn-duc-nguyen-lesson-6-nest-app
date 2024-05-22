import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import * as fs from 'fs';
import * as path from 'path';
import { Category } from './entities/category.entity';
@Injectable()
export class CategoriesService {
  private readonly dataCategoryFilePath = path.join(
    __dirname,
    '..',
    '../src/db/categories.json',
  );
  private generateId = (categories: Category[]) => {
    const id = categories.length + 1;
    return id;
  };
  private readCategoryJson = (filePath: string) => {
    const fileContent: Category[] = JSON.parse(
      fs.readFileSync(filePath, 'utf-8'),
    );
    return fileContent;
  };
  private writeCategoryJson = (filePath: string, category: Category[]) => {
    fs.writeFileSync(filePath, JSON.stringify(category));
  };

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const categories = await this.readCategoryJson(this.dataCategoryFilePath);

      const newCategory: Category = {
        ...createCategoryDto,
        id: this.generateId(categories),
      };
      const newCategories: Category[] = [...categories, newCategory];
      await this.writeCategoryJson(this.dataCategoryFilePath, newCategories);
      return newCategories;
    } catch (err) {
      throw new HttpException(err, err.status);
    }
  }

  async findAll() {
    try {
      const categories = await this.readCategoryJson(this.dataCategoryFilePath);
      return categories;
    } catch (err) {
      throw new HttpException(err, err.status);
    }
  }

  async findOne(id: number) {
    try {
      if (!id) {
        throw new HttpException('Id required', HttpStatus.NOT_FOUND);
      }
      const categories = await this.readCategoryJson(this.dataCategoryFilePath);
      const category = await categories.find((category) => category.id === id);
      console.log(category);
      if (!category) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      return category;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      if (!id) {
        throw new HttpException('Id required', HttpStatus.NOT_FOUND);
      }
      const categories = await this.readCategoryJson(this.dataCategoryFilePath);
      const categoryIndex = await categories.findIndex(
        (category) => category.id === id,
      );
      if (categoryIndex === -1) {
        throw new HttpException('Not found product', HttpStatus.NOT_FOUND);
      }
      const updatedCategory = {
        ...categories[categoryIndex],
        ...updateCategoryDto,
      };
      categories[categoryIndex] = updatedCategory;

      await this.writeCategoryJson(this.dataCategoryFilePath, categories);

      return updatedCategory;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  async remove(id: number) {
    try {
      if (!id) {
        throw new HttpException('Id required', HttpStatus.NOT_FOUND);
      }
      const categories: Category[] = await this.readCategoryJson(
        this.dataCategoryFilePath,
      );
      const categoryIndex = await categories.findIndex(
        (category) => category.id === id,
      );
      if (categoryIndex === -1) {
        throw new HttpException('Not found product', HttpStatus.NOT_FOUND);
      }
      categories.splice(categoryIndex, 1);

      await this.writeCategoryJson(this.dataCategoryFilePath, categories);

      return categories;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }
}
