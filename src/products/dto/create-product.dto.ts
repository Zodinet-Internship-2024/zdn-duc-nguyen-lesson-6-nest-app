import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  Length,
  IsPositive,
  IsUrl,
  IsNotEmpty,
} from 'class-validator';
export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @Length(3, 30)
  title: string;

  @ApiProperty()
  description: string;
  @ApiProperty()
  @IsPositive()
  price: number;
  @ApiProperty()
  @Transform(({ value }) => value ?? 0)
  @IsPositive()
  discount: number;
  @ApiProperty()
  @IsUrl()
  image: string;
  @ApiProperty()
  @IsNotEmpty()
  category: number;
}
