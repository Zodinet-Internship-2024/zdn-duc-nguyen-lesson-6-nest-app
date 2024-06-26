import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import * as fs from 'fs';
import * as path from 'path';
import { Product } from './entities/product.entity';
import { plainToInstance } from 'class-transformer';
import { ProductResponseDto } from './dto/product-response.dto';
@Injectable()
export class ProductsService {
  private readonly dataProductFilePath = path.join(
    __dirname,
    '..',
    '../../src/db/products.json',
  );

  private generateId = (products: Product[]) => {
    const id = products.length + 1;
    return id;
  };
  private readProductJson = (filePath: string) => {
    console.log(filePath);
    const fileContent: Product[] = JSON.parse(
      fs.readFileSync(filePath, 'utf-8'),
    );
    return fileContent;
  };
  private writeProductJson = (filePath: string, products: Product[]) => {
    fs.writeFileSync(filePath, JSON.stringify(products));
  };
  async create(createProductDto: CreateProductDto) {
    try {
      const products = await this.readProductJson(this.dataProductFilePath);

      const newProduct: Product = {
        ...createProductDto,
        id: this.generateId(products),
      };
      products.push(newProduct);
      this.writeProductJson(this.dataProductFilePath, products);
      return plainToInstance(ProductResponseDto, newProduct);
      // return {
      //   type: 'Success',
      //   message: 'suuccElymmm',
      //   newProduct,
      // };
    } catch (err) {
      throw new HttpException(err, err.status);
    }
  }

  async findAll() {
    try {
      const products = this.readProductJson(this.dataProductFilePath);

      return products.map((product) =>
        plainToInstance(ProductResponseDto, product),
      );
    } catch (err) {
      throw new HttpException(err, err.status);
    }
  }

  async findOne(id: number) {
    try {
      if (!id) {
        throw new HttpException('Id require', HttpStatus.NOT_FOUND);
      }
      const products = this.readProductJson(this.dataProductFilePath);
      const product = await products.find((product) => product.id === id);
      console.log(product);
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      return plainToInstance(ProductResponseDto, product);
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      if (!id) {
        throw new HttpException('Id required', HttpStatus.NOT_FOUND);
      }
      const products = await this.readProductJson(this.dataProductFilePath);
      const productIndex = await products.findIndex(
        (product) => product.id === id,
      );
      if (productIndex === -1) {
        throw new HttpException('Not found product', HttpStatus.NOT_FOUND);
      }
      const updatedProduct = { ...products[productIndex], ...updateProductDto };
      products[productIndex] = updatedProduct;

      await this.writeProductJson(this.dataProductFilePath, products);
      return plainToInstance(ProductResponseDto, updatedProduct);
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  async remove(id: number) {
    try {
      const products = await this.readProductJson(this.dataProductFilePath);
      const productIndex = await products.findIndex(
        (product) => product.id === id,
      );
      if (productIndex === -1) {
        throw new HttpException('Not found product', HttpStatus.NOT_FOUND);
      }
      products.splice(productIndex, 1);

      await this.writeProductJson(this.dataProductFilePath, products);

      return {
        type: 'Success',
        message: 'Remove successfully',
      };
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }
}
