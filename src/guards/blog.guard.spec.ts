import { BlogGuard } from './blog.guard';
import { PrismaService } from '../prisma/prisma.service';

describe('BlogGuard', () => {
  it('should be defined', () => {
    expect(new BlogGuard({} as PrismaService)).toBeDefined();
  });
});
