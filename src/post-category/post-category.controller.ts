import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostCategoryService } from './post-category.service';
import { CreatePostCategoryDto } from './dto/create-post-category.dto';
import { UpdatePostCategoryDto } from './dto/update-post-category.dto';
import JwtAuthenticationGuard from '../auth/guards/jwt-authentiacation.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from '../decorators/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('post-category')
@ApiTags('PostCategory')
export class PostCategoryController {
  constructor(private readonly postCategoryService: PostCategoryService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CONTENTMANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new post category' })
  create(@Body() createPostCategoryDto: CreatePostCategoryDto) {
    return this.postCategoryService.create(createPostCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all post categories' })
  findAll() {
    return this.postCategoryService.findAll();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a post category by slug' })
  findOne(@Param('slug') slug: string) {
    return this.postCategoryService.findOneBySlug(slug);
  }

  @Patch(':slug')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CONTENTMANAGER)
  @ApiBearerAuth()
  update(
    @Param('slug') slug: string,
    @Body() updatePostCategoryDto: UpdatePostCategoryDto,
  ) {
    return this.postCategoryService.update(slug, updatePostCategoryDto);
  }
}
