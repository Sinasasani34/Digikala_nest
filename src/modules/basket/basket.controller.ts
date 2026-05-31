import { Body, Controller, Delete, Get, Post } from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { BasketService } from "./basket.service";
import { AddToBasketDto } from "./dto/basket.dto";
import { FormType } from "src/common/enum/form-type.enum";

@Controller("basket")
@ApiTags("Basket")
export class BasketController {
  constructor(private basketService: BasketService) {}

  @Get()
  basket() {}

  @Post("/add")
  @ApiConsumes(FormType.UrlEncoded, FormType.JSON)
  addToBasket(@Body() basketDto: AddToBasketDto) {
    return this.basketService.addToBasket(basketDto);
  }

  @Post("/add-discount")
  addDiscountToBasket() {}

  @Delete("/remove")
  removeFromBasket() {}

  @Delete("/remove-discount")
  removeDiscountFromBasket() {}
}
