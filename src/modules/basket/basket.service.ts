import { BadRequestException, Injectable } from "@nestjs/common";
import { AddToBasketDto } from "./dto/basket.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { BasketEntity } from "./entity/basket.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { ProductService } from "../product/services/product.service";
import { ProductType } from "../product/enum/type.enum";
import { ProductSize } from "../product/entities/product-size.entity";
import { ProductColor } from "../product/entities/product-color.entity";
import { ProductColorService } from "../product/services/product-color.service";
import { ProductSizeService } from "../product/services/product-size.service";

@Injectable()
export class BasketService {
  constructor(
    @InjectRepository(BasketEntity)
    private basketRepository: Repository<BasketEntity>,
    private productService: ProductService,
    private productColorService: ProductColorService,
    private productSizeService: ProductSizeService,
  ) {}

  //   async addToBasket(basketDto: AddToBasketDto) {
  //     const { colorId, productId, sizeId } = basketDto;

  //     let size: ProductSize | undefined;
  //     let color: ProductColor | undefined;
  //     let where: FindOptionsWhere<BasketEntity> = {};

  //     const product = await this.productService.findOndLean(productId);
  //     where["productId"] = productId;

  //     if (product.type === ProductType.Coloring && !colorId) {
  //       throw new BadRequestException("شما باید یک رنگ یا کد رنگ وارد کنید");
  //     } else if (product.type === ProductType.Coloring && colorId) {
  //       if (isNaN(parseInt(colorId.toString()))) {
  //         throw new BadRequestException("شما باید یک رنگ یا کد رنگ وارد کنید");
  //       }
  //       color = await this.productColorService.findOne(colorId);
  //       where["colorId"] = colorId;
  //     } else if (product.type === ProductType.Sizing && !sizeId) {
  //       throw new BadRequestException("شما باید یک سایز وارد کنید");
  //     } else if (product.type === ProductType.Sizing && sizeId) {
  //       if (isNaN(parseInt(sizeId.toString()))) {
  //         throw new BadRequestException("شما باید یک سایز وارد کنید");
  //       }
  //       size = await this.productSizeService.findOne(sizeId);
  //       where["sizeId"] = sizeId;
  //     }

  //     // inserting to the basket

  //     let basketItem = await this.basketRepository.findOneBy(where);
  //     if (basketItem) {
  //       basketItem.count += 1;
  //     } else {
  //       basketItem = this.basketRepository.create({
  //         productId,
  //         sizeId: size?.id,
  //         colorId: color?.id,
  //         count: 1,
  //       });
  //     }
  //     await this.basketRepository.save(basketItem);
  //     return {
  //       message: "محصول به سبد خرید اضافه شد",
  //     };
  //   }

  async addToBasket(basketDto: AddToBasketDto) {
    const { colorId, productId, sizeId } = basketDto;

    let size: ProductSize | undefined;
    let color: ProductColor | undefined;
    let where: FindOptionsWhere<BasketEntity> = {};

    const product = await this.productService.findOndLean(productId);
    where["productId"] = productId;

    if (product.type === ProductType.Coloring && !colorId) {
      throw new BadRequestException("شما باید یک رنگ یا کد رنگ وارد کنید");
    } else if (product.type === ProductType.Coloring && colorId) {
      if (isNaN(parseInt(colorId.toString()))) {
        throw new BadRequestException("شما باید یک رنگ یا کد رنگ وارد کنید");
      }
      color = await this.productColorService.findOne(colorId);
      where["colorId"] = colorId;
    } else if (product.type === ProductType.Sizing && !sizeId) {
      throw new BadRequestException("شما باید یک سایز وارد کنید");
    } else if (product.type === ProductType.Sizing && sizeId) {
      if (isNaN(parseInt(sizeId.toString()))) {
        throw new BadRequestException("شما باید یک سایز وارد کنید");
      }
      size = await this.productSizeService.findOne(sizeId);
      where["sizeId"] = sizeId;
    }

    let basketItem = await this.basketRepository.findOneBy(where);
    if (basketItem) {
      basketItem.count += 1;
    } else {
      basketItem = this.basketRepository.create({
        productId,
        sizeId: size?.id,
        colorId: color?.id,
        count: 1,
      });
    }

    
    
    await this.basketRepository.save(basketItem);
    console.log("product.type =>", product.type);
    console.log("ProductType =>", ProductType);

    return {
      message: "محصول به سبد خرید اضافه شد",
    };
  }
}
