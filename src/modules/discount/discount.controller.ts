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
import { DiscountService } from "./discount.service";
import { FormType } from "src/common/enum/form-type.enum";
import { CreaeteDiscountDto, UpdateDiscountDto } from "./dto/discount.dto";

@Controller("discount")
@ApiTags("Discount")
export class DiscountController {
  constructor(private discountService: DiscountService) {}

  @Post()
  @ApiConsumes(FormType.UrlEncoded)
  create(@Body() discountDto: CreaeteDiscountDto) {
    return this.discountService.create(discountDto);
  }

  @Get()
  find() {
    return this.discountService.find();
  }

  @Put("/:id")
  @ApiConsumes(FormType.UrlEncoded)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() discountDto: UpdateDiscountDto,
  ) {
    return this.discountService.update(id, discountDto);
  }

  @Delete("/:id")
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.discountService.delete(id);
  }
}
