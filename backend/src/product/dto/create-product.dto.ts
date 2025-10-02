import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @Length(2, 32)
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price: number;

  image: string;
}
