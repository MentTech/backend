import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { Role, User } from '@prisma/client';

@Injectable()
export class BlogGuard implements CanActivate {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    if (user && user.role === Role.ADMIN) {
      return true;
    }
    const slug = request.params.slug;
    if (!slug) {
      return false;
    }
    return this.validate(user, slug);
  }

  async validate(user: User, slug: string): Promise<boolean> {
    const blog = await this.prisma.post.findFirst({
      where: {
        slug,
      },
    });
    if (!blog) {
      return false;
    }
    return blog.authorId === user.id;
  }
}
