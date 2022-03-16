import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryService } from './category.service';

const categoryArray = [
  {
    id: 1,
    name: 'test',
    createAt: new Date(),
  },
  {
    id: 2,
    name: 'test2',
    createAt: new Date(),
  },
];

const oneCategory = {
  id: 1,
  name: 'test',
  createAt: new Date(),
};

const db = {
  category: {
    findMany: jest.fn().mockResolvedValue(categoryArray),
    findUnique: jest.fn().mockResolvedValue(oneCategory),
    create: jest.fn().mockResolvedValue(oneCategory),
    update: jest.fn().mockResolvedValue(oneCategory),
    delete: jest.fn().mockResolvedValue(oneCategory),
  },
};

describe('CategoryService', () => {
  let service: CategoryService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new category', async () => {
    const category = await service.create({
      name: 'test',
    });
    expect(category.name).toEqual('test');
    expect(category.id).toEqual(1);
  });

  it('should return all category in db', async () => {
    const categories = await service.findAll();
    expect(categories.length).toEqual(2);
  });

  it('should return category with matching id', async () => {
    const category = await service.findOne(1);
    expect(category.id).toEqual(1);
  });

  it('update category with new name', async () => {
    const category = await service.update(1, {
      name: 'test',
    });
    expect(category.name).toEqual('test');
  });

  it('should delete category with matching id', async () => {
    const category = await service.remove(1);
    expect(category.id).toEqual(1);
  });
});
