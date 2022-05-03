import { Test, TestingModule } from '@nestjs/testing';
import { PostCategoryService } from './post-category.service';
import { PrismaService } from '../prisma/prisma.service';
import { SlugifyService } from '../slugify/slugify.service';

const mockPrismaService = {};
const mockSlugifyService = {};

describe('PostCategoryService', () => {
  let service: PostCategoryService;
  let prisma: PrismaService;
  let slugify: SlugifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostCategoryService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: SlugifyService,
          useValue: mockSlugifyService,
        },
      ],
    }).compile();

    service = module.get<PostCategoryService>(PostCategoryService);
    prisma = module.get<PrismaService>(PrismaService);
    slugify = module.get<SlugifyService>(SlugifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
