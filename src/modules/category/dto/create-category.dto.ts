import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateCategoryDto {
  @ApiProperty()
  title: string;

  @ApiPropertyOptional({ nullable: true })
  priority: number;

  @ApiPropertyOptional({ nullable: true })
  slug: string;

  @ApiProperty({ type: "boolean" })
  show: boolean;

  @ApiPropertyOptional({ nullable: true })
  parentId: number;
}
