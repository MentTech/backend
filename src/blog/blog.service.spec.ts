import { Test, TestingModule } from '@nestjs/testing';
import { BlogService } from './blog.service';
import { PrismaService } from '../prisma/prisma.service';
import { SlugifyService } from '../slugify/slugify.service';

const mockPrismaService = {};
const mockSlugifyService = {};

describe('BlogService', () => {
  let service: BlogService;
  let prisma: PrismaService;
  let slugify: SlugifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogService,
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

    service = module.get<BlogService>(BlogService);
    prisma = module.get<PrismaService>(PrismaService);
    slugify = module.get<SlugifyService>(SlugifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
