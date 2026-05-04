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
import { AddDetailDto, UpdateDetailDto } from "../dto/detail.dto";

@Controller("product-detail")
@ApiTags("Product-Detail")
export class ProductDetailController {
  constructor() {}

  @Post()
  @ApiConsumes("application/x-www-form-urlencoded")
  create(@Body() detailDto: AddDetailDto) {}

  @Get()
  find() {}

  @Put("/:id")
  @ApiConsumes("application/x-www-form-urlencoded")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() detailDto: UpdateDetailDto,
  ) {}

  @Delete("/:id")
  @ApiConsumes("application/x-www-form-urlencoded")
  delete(@Param("id", ParseIntPipe) id: number) {}
}
