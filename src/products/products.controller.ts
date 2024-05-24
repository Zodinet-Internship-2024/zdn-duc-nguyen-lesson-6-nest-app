import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpException,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { PermissionGuard } from 'src/auth/permission.guard';
import { Permissions } from 'src/auth/entities/permisson.decorator';
import { Permission } from 'src/auth/permisson/permisson';
import { User } from 'src/auth/decorator/user.decorator';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ProductResponseDto } from './dto/product-response.dto';
@ApiBearerAuth()
@Controller('products')
@UseGuards(PermissionGuard)
@UseGuards(AuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiResponse({
    status: 201,
    type: ProductResponseDto,
  })
  @Permissions(Permission.Write_Product)
  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productsService.create(createProductDto);
  }

  @Permissions(Permission.Read_Product)
  @Get()
  findAll(@User() user: any): Promise<ProductResponseDto[]> {
    console.log('123 :usernames', user);
    return this.productsService.findAll();
  }

  // @UseGuards(PermissionGuard)
  @ApiResponse({
    type: ProductResponseDto,
  })
  @Permissions(Permission.Read_Product)
  @Get(':id')
  findOne(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<ProductResponseDto> {
    console.log(id);
    if (!id) {
      throw new HttpException('Id required', HttpStatus.NOT_FOUND);
    }
    return this.productsService.findOne(+id);
  }
  @ApiResponse({
    type: ProductResponseDto,
  })
  @Permissions(Permission.Update_Product)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    if (!id) {
      throw new HttpException('Id required', HttpStatus.NOT_FOUND);
    }
    return this.productsService.update(+id, updateProductDto);
  }
  // @UseGuards(PermissionGuard)
  // @UseGuards(AuthGuard)

  @Permissions(Permission.Delete_Product)
  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!id) {
      throw new HttpException('Id required', HttpStatus.NOT_FOUND);
    }
    return this.productsService.remove(+id);
  }
}
