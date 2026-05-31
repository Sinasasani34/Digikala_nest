import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { AddColorDto, UpdateColorDto } from "../dto/color.dto";
import { ProductColor } from "../entities/product-color.entity";
import { toBoolean } from "src/common/utils/functions";
import { Product } from "../entities/product.entity";
import { ProductType } from "../enum/type.enum";

@Injectable()
export class ProductColorService {
  constructor(
    @InjectRepository(ProductColor)
    private productColorRepository: Repository<ProductColor>,
    private dataSource: DataSource,
  ) {}

  async create(colorDto: AddColorDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      let {
        active_discount,
        color_code,
        color_name,
        count,
        discount,
        price,
        productId,
      } = colorDto;
      let product = await queryRunner.manager.findOneBy(Product, {
        id: productId,
      });
      if (product?.type !== ProductType.Coloring) {
        throw new BadRequestException("لطفا رنگ کالا را درست وارد کنید");
      }
      if (!product) {
        throw new NotFoundException("محصولی یافته نشد");
      }
      await queryRunner.manager.insert(ProductColor, {
        count,
        discount,
        price,
        color_code,
        color_name,
        active_discount: toBoolean(active_discount),
        productId,
      });
      if (!isNaN(parseInt(count.toString())) && +count > 0) {
        product.count =
          parseInt(product.count.toString()) + parseInt(count.toString());
        await queryRunner.manager.save(Product, product);
      }
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return {
        message: "مشخصات محصول با موفقیت ایجاد شد",
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw error;
    }
  }

  async update(id: number, colorDto: UpdateColorDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      let {
        active_discount,
        color_code,
        color_name,
        count,
        discount,
        price,
        productId,
      } = colorDto;

      let product = await queryRunner.manager.findOneBy(Product, {
        id: productId,
      });
      if (!product) {
        throw new NotFoundException("محصولی یافته نشد");
      }

      let color = await queryRunner.manager.findOneBy(ProductColor, {
        id,
      });
      if (!color) {
        throw new NotFoundException("محصولی یافته نشد");
      }

      if (color_name) color.color_name = color_name;
      if (color_code) color.color_code = color_code;
      if (active_discount) color.active_discount = toBoolean(active_discount);
      if (discount) color.discount = discount;
      if (price) color.price = price;

      let previousCount = color.count;
      if (
        count !== undefined &&
        !isNaN(parseInt(count.toString())) &&
        +count > 0
      ) {
        product.count =
          parseInt(product.count.toString()) -
          parseInt(previousCount.toString());
        product.count =
          parseInt(product.count.toString()) + parseInt(count.toString());
        color.count = count;
        await queryRunner.manager.save(Product, product);
      }
      await queryRunner.manager.save(ProductColor, color);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return {
        message: "مشخصات محصول با موفقیت ایجاد شد",
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw error;
    }
  }

  async find(productId: number) {
    return this.productColorRepository.find({
      where: { productId },
    });
  }

  async findOne(id: number) {
    const color = await this.productColorRepository.findOne({
      where: { id },
    });

    if (!color) {
      throw new NotFoundException("محصول با این شناسه یافته نشد");
    }
    return color;
  }

  async delete(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();

      const color = await queryRunner.manager.findOneBy(ProductColor, { id });
      if (!color) {
        throw new NotFoundException("مشخصاتی یافته نشد");
      }
      if (color.count && color.count > 0) {
        const product = await queryRunner.manager.findOneBy(Product, {
          id: color.productId,
        });

        if (!product || product.count == null)
          throw new NotFoundException("محصولی یافته نشد");

        product.count =
          parseInt(product.count.toString()) - parseInt(color.count.toString());
        await queryRunner.manager.save(Product, product);
      }

      await queryRunner.manager.delete(ProductColor, { id });

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return {
        message: "مشخصات محصول با موفقیت حذف شد",
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw error;
    }
  }
}
