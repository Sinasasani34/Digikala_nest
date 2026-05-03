import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, Length } from "class-validator";
import { ProductType } from "../enum/type.enum";

export class AddColorDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 30)
  color_name: string;

  @ApiProperty()
  color_code: string;

  @ApiProperty()
  productId: number;

  @ApiPropertyOptional()
  price: number;

  @ApiPropertyOptional()
  count: number;

  @ApiPropertyOptional()
  discount: number;

  @ApiPropertyOptional({ type: "boolean" })
  active_discount: boolean;
}

export class UpdateColorDto extends PartialType(AddColorDto) {}
