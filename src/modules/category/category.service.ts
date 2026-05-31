import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryEntity } from "./entities/category.entity";
import { Not, Repository } from "typeorm";

import {
  paginationGenerator,
  paginationSolver,
} from "src/common/utils/pagination.util";
import { PaginationDto } from "src/common/dto/pagination.dto";
import slugify from "slugify";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    let { priority, title } = createCategoryDto;
    title = await this.checkExistAndResolveByTitle(title);

    const baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;

    let counter = 1;
    while (await this.categoryRepository.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const category = this.categoryRepository.create({
      title,
      priority,
      slug,
      show: true,
    });

    await this.categoryRepository.save(category);
    return {
      message: "دسته بندی با موفقیت ایجاد شد",
    };
  }

  async insertByTitle(title: string) {
    const category = this.categoryRepository.create({
      title,
    });
    return await this.categoryRepository.save(category);
  }

  async checkExistAndResolveByTitle(title: string) {
    // بررسی کردن وجود تایتل های تکراری برای ایجاد دسته بندی
    title = title.trim()?.toLowerCase();
    const category = await this.categoryRepository.findOneBy({ title });
    // ارور وجود دسته بندی و جلو گیری برای ایجاد دسته بندی های تکراری
    if (category) throw new ConflictException("دسته بندی وجود دارد!!!");
    return title;
  }

  async findAll(skip: number, limit: number, page: number) {
    const [categories, count] = await this.categoryRepository.findAndCount({
      where: {},
      skip,
      take: limit,
    });
    return {
      pagination: paginationGenerator(count, page, limit),
      categories,
    };
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException("دسته بندی مورد نظر یافته نشد");
    return category;
  }

  async findOneByTitle(title: string) {
    return await this.categoryRepository.findOneBy({ title });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    const { priority, title } = updateCategoryDto;

    if (title) {
      category.title = title;
      const baseSlug = slugify(title, { lower: true, strict: true });
      let slug = baseSlug;
      let counter = 1;
      while (
        await this.categoryRepository.findOne({
          where: { slug, id: Not(id) }, // TypeORM: import { Not } from 'typeorm'
        })
      ) {
        slug = `${baseSlug}-${counter++}`;
      }
      category.slug = slug;
    }

    if (priority) category.priority = priority;

    await this.categoryRepository.save(category);
    return { message: "دسته‌بندی با موفقیت بروزرسانی شد" };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.categoryRepository.delete({ id });
    return {
      message: "حذف شد",
    };
  }
}
