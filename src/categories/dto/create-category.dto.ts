import { IsString, IsNotEmpty, Length } from 'class-validator';
export class CreateCategoryDto {
  @IsString()
  @Length(3, 30)
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;
}
