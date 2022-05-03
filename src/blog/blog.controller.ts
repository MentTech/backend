import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchPostsDto } from './dto/search-posts.dto';
import JwtAuthenticationGuard from '../auth/guards/jwt-authentiacation.guard';
import { RolesGuard } from '../guards/roles.guard';
import { BlogGuard } from '../guards/blog.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';
import { GetUser } from '../decorators/get-user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { SearchOwnerPostsDto } from './dto/search-owner-posts.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('blog')
@ApiTags('Blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get('/search')
  @ApiOperation({ summary: 'Search posts' })
  search(@Query() query: SearchPostsDto) {
    return this.blogService.searchPost(query);
  }

  @Get('/search/authorize')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Search posts (AUTHORIZE)' })
  @ApiBearerAuth()
  searchAuthorize(@Query() query: SearchPostsDto) {
    return this.blogService.searchPost(query, true);
  }

  @Get('/search/author')
  @UseGuards(JwtAuthenticationGuard, RolesGuard, BlogGuard)
  @Roles(Role.ADMIN, Role.CONTENTMANAGER)
  @ApiOperation({ summary: 'Search posts (AUTHOR)' })
  @ApiBearerAuth()
  searchAuthorPost(@Query() query: SearchOwnerPostsDto, @GetUser() user: any) {
    const dto: SearchPostsDto = { ...query, authorId: user.id };
    return this.blogService.searchPost(dto, true);
  }

  @Post('/')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CONTENTMANAGER)
  @ApiOperation({ summary: 'Create post' })
  @ApiBearerAuth()
  create(@GetUser() user, @Body() body: CreatePostDto) {
    return this.blogService.createPost(body, user.id);
  }

  @Get('/:slug')
  @ApiOperation({ summary: 'Get post' })
  get(@Query('slug') slug: string) {
    return this.blogService.getPost(slug);
  }

  @Get('/:slug/authorize')
  @UseGuards(JwtAuthenticationGuard, RolesGuard, BlogGuard)
  @Roles(Role.ADMIN, Role.CONTENTMANAGER)
  @ApiOperation({ summary: 'Get post (AUTHORIZE)' })
  @ApiBearerAuth()
  getPostAuthorize(@Query('slug') slug: string) {
    return this.blogService.getPost(slug, true);
  }

  @Patch('/:slug')
  @UseGuards(JwtAuthenticationGuard, RolesGuard, BlogGuard)
  @Roles(Role.ADMIN, Role.CONTENTMANAGER)
  @ApiOperation({ summary: 'Update post' })
  @ApiBearerAuth()
  update(@Query('slug') slug: string, @Body() body: UpdatePostDto) {
    return this.blogService.updatePost(slug, body);
  }

  @Delete('/:slug')
  @UseGuards(JwtAuthenticationGuard, RolesGuard, BlogGuard)
  @Roles(Role.ADMIN, Role.CONTENTMANAGER)
  @ApiOperation({ summary: 'Delete post' })
  @ApiBearerAuth()
  delete(@Query('slug') slug: string) {
    return this.blogService.deletePost(slug);
  }
}
