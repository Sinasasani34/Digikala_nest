import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { CreateProductDto, UpdateProductDto } from "../dto/product.dto";

@Controller("product-color")
@ApiTags("Product-color")
export class ProductColorController {
  constructor() {}

  @Post()
  @ApiConsumes("application/x-www-from-urlencoded")
  create(@Body() productDto: CreateProductDto) {}

  @Get()
  find() {}

  @Put("/:id")
  @ApiConsumes("application/x-www-from-urlencoded")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() productDto: UpdateProductDto,
  ) {}

  @Delete("/:id")
  @ApiConsumes("application/x-www-from-urlencoded")
  delete(@Param("id", ParseIntPipe) id: number) {}
}
