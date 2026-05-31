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
import { AddColorDto, UpdateColorDto } from "../dto/color.dto";
import { ProductColorService } from "../services/product-color.service";
import { FormType } from "src/common/enum/form-type.enum";

@Controller("product-color")
@ApiTags("Product-color")
export class ProductColorController {
  constructor(private colorService: ProductColorService) {}

  @Post()
  @ApiConsumes(FormType.UrlEncoded)
  create(@Body() colorDto: AddColorDto) {
    return this.colorService.create(colorDto);
  }

  @Get("/product/:productId")
  find(@Param("productId", ParseIntPipe) productId: number) {
    return this.colorService.find(productId);
  }

  @Put("/:id")
  @ApiConsumes("application/x-www-form-urlencoded")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() colorDto: UpdateColorDto,
  ) {
    return this.colorService.update(id, colorDto);
  }

  @Delete("/:id")
  @ApiConsumes("application/x-www-form-urlencoded")
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.colorService.delete(id);
  }
}
