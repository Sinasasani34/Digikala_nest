import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "../entities/product.entity";
import { DeepPartial, Repository } from "typeorm";
import { CreateProductDto, UpdateProductDto } from "../dto/product.dto";
import { ProductType } from "../enum/type.enum";
import { toBoolean } from "src/common/utils/functions";
import { CategoryEntity } from "src/modules/category/entities/category.entity";
import { CategoryService } from "src/modules/category/category.service";
import { isArray } from "class-validator";
import { ProductCategoryEntity } from "../entities/product-category.entity";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductCategoryEntity)
    private productCategoryRepository: Repository<ProductCategoryEntity>,
    private categoryService: CategoryService,
  ) {}

  async create(prodcutDto: CreateProductDto) {
    let {
      title,
      slug,
      active_discount,
      code,
      content,
      count,
      discount,
      price,
      type,
      categories,
    } = prodcutDto;

    const productObject: DeepPartial<Product> = {
      title,
      content,
      slug,
      code,
      discount,
      active_discount: toBoolean(active_discount),
    };

    if (!isArray(categories) && typeof categories === "string") {
      categories = categories.split(".");
    } else if (!isArray(categories)) {
      throw new BadRequestException();
    }

    if (type === ProductType.Single) {
      Object.assign(productObject, { price, count, type });
    } else if (
      [ProductType.Coloring, ProductType.Sizing].includes(type as any)
    ) {
      productObject["type"] = type;
    } else {
      throw new BadRequestException("product type is invalid");
    }
    await this.productRepository.save(productObject);
    for (const categoryTitle of categories) {
      let category = await this.categoryService.findOneByTitle(categoryTitle);
      if (!category) {
        category = await this.categoryService.insertByTitle(categoryTitle);
      }
      await this.productCategoryRepository.insert({
        productId: productObject.id,
        categoryId: category.id
      })
    }
    return {
      message: "محصول با موفقیت ایجاد شد",
    };
  }

  async update(id: number, prodcutDto: UpdateProductDto) {
    const {
      title,
      slug,
      active_discount,
      code,
      content,
      count,
      discount,
      price,
      type,
    } = prodcutDto;

    const product = await this.findOndLean(id);

    if (title) product.title = title;
    if (slug) product.slug = slug;
    if (content) product.content = content;
    if (discount) product.discount = discount;
    if (active_discount) product.active_discount = toBoolean(active_discount);
    if (code) product.code = code;
    if (type === ProductType.Single) {
      Object.assign(product, { price, count });
    }

    await this.productRepository.save(product);
    return {
      message: "Updated Product Successfully",
    };
  }

  async find() {
    return this.productRepository.find({
      where: {},
      relations: { colors: true, sizes: true, details: true },
    });
  }

  async findOnde(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { colors: true, sizes: true, details: true },
    });

    if (!product) {
      throw new NotFoundException("محصول با این شناسه یافته نشد");
    }
    return product;
  }

  //   یک چیز جمع و جور
  async findOndLean(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException("محصول با این شناسه یافته نشد");
    }
    return product;
  }

  async delete(id: number) {
    await this.findOnde(id);
    await this.productRepository.delete({ id });
    return {
      message: "محصول با موفقیت حذف شد",
    };
  }
}
