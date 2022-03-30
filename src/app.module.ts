import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import authConfig from '../config/auth.config';
import commonConfig from '../config/common.config';
import { MentorModule } from './mentor/mentor.module';
import { AdminModule } from './admin/admin.module';
import { SkillModule } from './skill/skill.module';
import { CategoryModule } from './category/category.module';
import { TransactionModule } from './transaction/transaction.module';
import { LogResponseMiddleware } from './middlewares/log-response.middleware';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [authConfig, commonConfig],
    }),
    MentorModule,
    AdminModule,
    SkillModule,
    CategoryModule,
    TransactionModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LogResponseMiddleware).forRoutes('*');
  }
}
