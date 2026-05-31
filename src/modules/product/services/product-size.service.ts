import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { AddSizeDto, UpdateSizeDto } from "../dto/size.dto";
import { ProductSize } from "../entities/product-size.entity";
import { toBoolean } from "src/common/utils/functions";
import { Product } from "../entities/product.entity";
import { ProductType } from "../enum/type.enum";

@Injectable()
export class ProductSizeService {
  constructor(
    @InjectRepository(ProductSize)
    private productSizeRepository: Repository<ProductSize>,
    private dataSource: DataSource,
  ) {}

  async create(sizeDto: AddSizeDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      let { active_discount, count, discount, price, productId, size } =
        sizeDto;
      let product = await queryRunner.manager.findOneBy(Product, {
        id: productId,
      });
      if (product?.type !== ProductType.Sizing) {
        throw new BadRequestException("لطفا سایز محصول را به درستی وارد کنید");
      }
      if (!product) {
        throw new NotFoundException("محصولی یافته نشد");
      }
      await queryRunner.manager.insert(ProductSize, {
        count,
        discount,
        price,
        size,
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

  async update(id: number, sizeDto: UpdateSizeDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      let {
        active_discount,
        count,
        discount,
        price,
        productId,
        size: sizeTitle,
      } = sizeDto;

      let product = await queryRunner.manager.findOneBy(Product, {
        id: productId,
      });
      if (!product) {
        throw new NotFoundException("محصولی یافته نشد");
      }

      let size = await queryRunner.manager.findOneBy(ProductSize, {
        id,
      });
      if (!size) {
        throw new NotFoundException("محصولی یافته نشد");
      }

      if (sizeTitle) size.size = sizeTitle;
      if (active_discount) size.active_discount = toBoolean(active_discount);
      if (discount) size.discount = discount;
      if (price) size.price = price;

      // size: 10 count
      // size: 5 count
      // product 10 + 5 => 15
      let previousCount = size.count;
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
        size.count = count;
        await queryRunner.manager.save(Product, product);
      }
      await queryRunner.manager.save(ProductSize, size);
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
    return this.productSizeRepository.find({
      where: { productId },
    });
  }

  async findOne(id: number) {
    const size = await this.productSizeRepository.findOne({
      where: { id },
    });

    if (!size) {
      throw new NotFoundException("محصول با این شناسه یافته نشد");
    }
    return size;
  }

  async delete(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();

      const size = await queryRunner.manager.findOneBy(ProductSize, { id });
      if (!size) {
        throw new NotFoundException("مشخصاتی یافته نشد");
      }
      if (size.count && size.count > 0) {
        const product = await queryRunner.manager.findOneBy(Product, {
          id: size.productId,
        });

        if (!product || product.count == null)
          throw new NotFoundException("محصولی یافته نشد");

        product.count =
          parseInt(product.count.toString()) - parseInt(size.count.toString());
        await queryRunner.manager.save(Product, product);
      }

      await queryRunner.manager.delete(ProductSize, { id });

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
