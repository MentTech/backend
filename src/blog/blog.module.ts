import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { SlugifyModule } from '../slugify/slugify.module';
import { PrismaModule } from '../prisma/prisma.module';
import { BlogController } from './blog.controller';

@Module({
  imports: [SlugifyModule, PrismaModule],
  providers: [BlogService],
  controllers: [BlogController],
})
export class BlogModule {}
