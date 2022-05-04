import { Injectable, NotFoundException } from '@nestjs/common';
import { SlugifyService } from '../slugify/slugify.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from '../prisma/prisma.service';
import { SearchPostsDto } from './dto/search-posts.dto';
import { Prisma } from '@prisma/client';
import { PaginationResponseDto } from '../dtos/pagination-response.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import * as _ from 'lodash';

@Injectable()
export class BlogService {
  constructor(
    private readonly slugifyService: SlugifyService,
    private readonly prisma: PrismaService,
  ) {}

  createPost(dto: CreatePostDto, authorId: number) {
    if (!dto.summary) {
      dto.summary = dto.content.substring(0, 100);
    }
    const publishedAt = dto.isPublished ? new Date() : undefined;
    const slug = this.slugifyService.createUniqueSlug(dto.title);
    return this.prisma.post.create({
      data: {
        title: dto.title,
        author: {
          connect: {
            id: authorId,
          },
        },
        slug,
        content: dto.content,
        summary: dto.summary,
        image: dto.image,
        isPrivate: dto.isPrivate,
        isPublished: dto.isPublished,
        publishedAt,
        categories: {
          connect: dto.categories.map((category) => ({
            id: category,
          })),
        },
      },
    });
  }

  async getPost(slug: string, isOwner: boolean = false) {
    const post = await this.prisma.post.findFirst({
      where: {
        slug,
        isPrivate: isOwner ? undefined : false,
        isPublished: isOwner ? undefined : true,
      },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async searchPost(query: SearchPostsDto, isAdmin: boolean = false) {
    const { categories } = query;
    const where: Prisma.PostWhereInput = {
      isPublished: isAdmin ? undefined : true,
      isPrivate: isAdmin ? undefined : false,
      authorId: query.authorId,
    };
    if (query.keyword) {
      where.OR = {
        title: {
          search: query.keyword,
        },
        content: {
          search: query.keyword,
        },
      };
    }
    if (categories && categories.length > 0) {
      where.categories = {
        some: {
          id: {
            in: categories,
          },
        },
      };
    }
    const count = await this.prisma.post.count({
      where,
    });
    const totalPages = Math.ceil(count / query.limit);
    const posts = await this.prisma.post.findMany({
      where,
      orderBy: {
        [query.orderBy]: query.orderDirection,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        image: true,
        summary: true,
        createAt: true,
        publishedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        categories: {
          select: {
            id: true,
            title: true,
          },
        },
      }
    });
    return new PaginationResponseDto({
      totalPage: totalPages,
      page: query.page,
      limit: query.limit,
      data: posts,
    });
  }

  async updatePost(slug: string, dto: UpdatePostDto) {
    const post = await this.prisma.post.findFirst({
      where: {
        slug,
      },
      include: {
        categories: true,
      },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const { categories } = post;
    const categoryIds = categories.map((category) => category.id);
    const categoriesToAdd = _.difference(dto.categories, categoryIds);
    const categoriesToRemove = _.difference(categoryIds, dto.categories);
    const data: Prisma.PostUpdateInput = {
      title: dto.title,
      content: dto.content,
      summary: dto.summary,
      image: dto.image,
      isPrivate: dto.isPrivate,
      categories: {
        disconnect: categoriesToRemove.map((category) => ({
          id: category,
        })),
        connect: categoriesToAdd.map((category) => ({
          id: category,
        })),
      },
    };
    if (dto.title) {
      data.slug = this.slugifyService.createUniqueSlug(dto.title);
    }
    return this.prisma.post.update({
      where: {
        slug,
      },
      data,
    });
  }

  deletePost(slug: string) {
    return this.prisma.post.delete({
      where: {
        slug,
      },
    });
  }
}
