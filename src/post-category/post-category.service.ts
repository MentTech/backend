import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostCategoryDto } from './dto/create-post-category.dto';
import { UpdatePostCategoryDto } from './dto/update-post-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { SlugifyService } from '../slugify/slugify.service';

@Injectable()
export class PostCategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly slugifyService: SlugifyService,
  ) {}

  create(createPostCategoryDto: CreatePostCategoryDto) {
    return this.prisma.postCategory.create({
      data: {
        ...createPostCategoryDto,
        slug: this.slugifyService.createUniqueSlug(createPostCategoryDto.title),
      },
    });
  }

  findAll() {
    return this.prisma.postCategory.findMany();
  }

  async findOne(id: number) {
    const category = await this.prisma.postCategory.findFirst({
      where: {
        id,
      },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async findOneBySlug(slug: string) {
    const category = await this.prisma.postCategory.findFirst({
      where: {
        slug,
      },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  update(slug: string, updatePostCategoryDto: UpdatePostCategoryDto) {
    return this.prisma.postCategory.update({
      where: {
        slug,
      },
      data: {
        ...updatePostCategoryDto,
        slug: updatePostCategoryDto.title
          ? this.slugifyService.createUniqueSlug(updatePostCategoryDto.title)
          : undefined,
      },
    });
  }
}
