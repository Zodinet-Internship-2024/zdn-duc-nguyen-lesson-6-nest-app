import { Transform } from 'class-transformer';
import {
  IsString,
  Length,
  IsPositive,
  IsUrl,
  IsNotEmpty,
} from 'class-validator';
export class CreateProductDto {
  @IsString()
  @Length(3, 30)
  title: string;

  description: string;

  @IsPositive()
  price: number;

  @Transform(({ value }) => value ?? 0)
  @IsPositive()
  discount: number;

  @IsUrl()
  image: string;

  @IsNotEmpty()
  category: number;
}
