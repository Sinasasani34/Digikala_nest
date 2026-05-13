import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductDetail } from "../entities/product-detail.entity";
import { AddDetailDto, UpdateDetailDto } from "../dto/detail.dto";
import { ProductService } from "./product.service";

@Injectable()
export class ProductDetailService {
  constructor(
    @InjectRepository(ProductDetail)
    private productDetailRepository: Repository<ProductDetail>,
    private productService: ProductService,
  ) {}

  async create(detailDto: AddDetailDto) {
    let { key, value, productId } = detailDto;
    await this.productService.findOnde(productId);
    await this.productDetailRepository.insert({
      key,
      value,
      productId,
    });
    return {
      message: "مشخصات محصول با موفقیت ایجاد شد",
    };
  }

  async update(id: number, detailDto: UpdateDetailDto) {
    const { key, productId, value } = detailDto;
    const detail = await this.findOne(id);
    if (productId) {
      await this.productService.findOnde(productId);
      detail.productId = productId;
    }
    if (key) detail.key = key;
    if (value) detail.value = value;
    await this.productDetailRepository.save(detail);
    return {
      message: "مشخصات محصول با موفقیت بروزرسانی شد",
    };
  }

  async find(productId: number) {
    return this.productDetailRepository.find({
      where: { productId },
    });
  }

  async findOne(id: number) {
    const detail = await this.productDetailRepository.findOne({
      where: { id },
    });

    if (!detail) {
      throw new NotFoundException("محصول با این شناسه یافته نشد");
    }
    return detail;
  }

  async delete(id: number) {
    await this.findOne(id);
    await this.productDetailRepository.delete({ id });
    return {
      message: "مشخصات محصول با موفقیت حذف شد",
    };
  }
}
