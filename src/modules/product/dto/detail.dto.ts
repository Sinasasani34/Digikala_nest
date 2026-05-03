import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, Length } from "class-validator";
import { ProductType } from "../enum/type.enum";

export class AddDetailDto {
  @ApiProperty()
  productId: number;

  @ApiPropertyOptional()
  Key: string;

  @ApiPropertyOptional()
  Value: string;
}

export class UpdateDetailDto extends PartialType(AddDetailDto) {}
