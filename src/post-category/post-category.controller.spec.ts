import { Test, TestingModule } from '@nestjs/testing';
import { PostCategoryController } from './post-category.controller';
import { PostCategoryService } from './post-category.service';

const mockPostCategoryService = {};

describe('PostCategoryController', () => {
  let controller: PostCategoryController;
  let service: PostCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostCategoryController],
      providers: [
        {
          provide: PostCategoryService,
          useValue: mockPostCategoryService,
        },
      ],
    }).compile();

    controller = module.get<PostCategoryController>(PostCategoryController);
    service = module.get<PostCategoryService>(PostCategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
