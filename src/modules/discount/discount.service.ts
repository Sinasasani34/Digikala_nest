import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DiscountEntity } from "./entity/discount.entity";
import { DeepPartial, Repository } from "typeorm";
import { CreaeteDiscountDto, UpdateDiscountDto } from "./dto/discount.dto";
import { DiscountType } from "./enum/type.enum";
import { ProductService } from "../product/services/product.service";

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(DiscountEntity)
    private discountRepository: Repository<DiscountEntity>,
    private productService: ProductService,
  ) {}

  async create(createDto: CreaeteDiscountDto) {
    const { type, amount, code, expires_in, limit, percent, productId } =
      createDto;

    let discountObject: DeepPartial<DiscountEntity> = { code };
    if (type === DiscountType.Product) {
      const product = await this.productService.findOndLean(productId);
      discountObject["productId"] = product.id;
      discountObject["type"] = DiscountType.Product;
    } else {
      discountObject["type"] = DiscountType.Basket;
    }

    if (limit && !isNaN(parseInt(limit.toString()))) {
      discountObject["limit"] = +limit;
    }
    if ((amount && percent) || (!amount && !percent)) {
      throw new BadRequestException("شما باید یا درصد یا مقدار را وارد کنید");
    }
    if (amount && isNaN(parseInt(amount.toString()))) {
      throw new BadRequestException("شما باید مقدار را وارد کنید");
    } else if (amount) {
      discountObject["amount"] = +amount;
    } else if (percent && isNaN(parseInt(percent.toString()))) {
      throw new BadRequestException("شما باید درصد را وارد کنید");
    } else if (percent) {
      discountObject["percent"] = +percent;
    }

    if (expires_in && new Date(expires_in).toString() === "Invalid Date") {
      throw new BadRequestException("تاریخ انقضا باید یک تاریخ باشد");
    } else if (expires_in) {
      discountObject["expires_in"] = new Date(expires_in);
    }

    const discount = await this.getDiscountByCode(code);
    if (discount) {
      throw new ConflictException("کد تخفیف وجو دارد");
    }

    await this.discountRepository.save(discountObject);
    return {
      message: "کد تخفیف ایجاد شد",
    };
  }

  async getDiscountByCode(code: string) {
    const discount = await this.discountRepository.findOneBy({ code });
    return discount;
  }

  async find() {
    return this.discountRepository.find();
  }

  async update(id: number, updateDto: UpdateDiscountDto) {
    const discount = await this.discountRepository.findOneBy({ id });
    if (!discount) {
      throw new NotFoundException("تخفیفی یافته نشد");
    }
    const { type, amount, code, expires_in, limit, percent, productId } =
      updateDto;

    if (type === DiscountType.Product && productId) {
      const product = await this.productService.findOndLean(productId);
      discount.productId = product.id;
      discount.type = DiscountType.Product;
    } else if (type === DiscountType.Basket) {
      discount.type = DiscountType.Basket;
    }

    if (limit && !isNaN(parseInt(limit.toString()))) {
      discount.limit = +limit;
    }
    if (amount && percent) {
      throw new BadRequestException("شما باید یا درصد یا مقدار را وارد کنید");
    }
    if (amount && isNaN(parseInt(amount.toString()))) {
      throw new BadRequestException("شما باید مقدار را وارد کنید");
    } else if (amount) {
      discount.amount = +amount;
    } else if (percent && isNaN(parseInt(percent.toString()))) {
      throw new BadRequestException("شما باید درصد را وارد کنید");
    } else if (percent) {
      discount.percent = +percent;
    }

    if (expires_in && new Date(expires_in).toString() === "Invalid Date") {
      throw new BadRequestException("تاریخ انقضا باید یک تاریخ باشد");
    } else if (expires_in) {
      discount.expires_in = new Date(expires_in);
    }

    if (code) {
      const discountRow = await this.getDiscountByCode(code);
      if (discountRow && discountRow.id !== id) {
        throw new ConflictException("کد تخفیف وجو دارد");
      }
    }

    await this.discountRepository.save(discount);
    return {
      message: "کد تخفیف بروزرسانی شد",
    };
  }

  async delete(id: number) {
    const discount = await this.discountRepository.findOneBy({ id });
    if (!discount) throw new NotFoundException("کدی یافته نشد");
    await this.discountRepository.delete({ id });
    return {
      message: "کد حذف شد",
    };
  }
}
