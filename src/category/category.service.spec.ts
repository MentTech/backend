import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let service: CategoryService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [CategoryService],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create new category', async () => {
    prisma.category.create = jest.fn().mockResolvedValue({
      id: 1,
      name: 'test',
      createAt: new Date(),
    });
    const category = await service.create({
      name: 'test',
    });
    expect(category.name).toEqual('test');
    expect(category.id).toEqual(1);
  });

  it('should return all category in db', async () => {
    prisma.category.findMany = jest.fn().mockResolvedValue([
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
    ]);
    const categories = await service.findAll();
    expect(categories.length).toEqual(2);
  });

  it('should return category with matching id', async () => {
    prisma.category.findUnique = jest.fn().mockResolvedValue({
      id: 1,
      name: 'test',
      createAt: new Date(),
    });
    const category = await service.findOne(1);
    expect(category.id).toEqual(1);
  });

  it('update category with new name', async () => {
    prisma.category.update = jest.fn().mockResolvedValue({
      id: 1,
      name: 'test',
      createAt: new Date(),
    });
    const category = await service.update(1, {
      name: 'test',
    });
    expect(category.name).toEqual('test');
  });

  it('should delete category with matching id', async () => {
    prisma.category.delete = jest.fn().mockResolvedValue({
      id: 1,
      name: 'test',
      createAt: new Date(),
    });
    const category = await service.remove(1);
    expect(category.id).toEqual(1);
  });
});
