import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, Length } from "class-validator";
import { ProductType } from "../enum/type.enum";

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 30)
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  code: string;

  @ApiProperty({ enum: ProductType })
  type: string;

  @ApiPropertyOptional()
  price: number;

  @ApiPropertyOptional()
  count: number;

  @ApiPropertyOptional()
  discount: number;

  @ApiPropertyOptional()
  active_discount: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
