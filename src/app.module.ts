import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import authConfig from './config/auth.config';
import commonConfig from './config/common.config';
import mailConfig from './config/mail.config';
import transactionConfig from './config/transaction.config';
import paypalConfig from './config/paypal.config';
import { MentorModule } from './mentor/mentor.module';
import { AdminModule } from './admin/admin.module';
import { SkillModule } from './skill/skill.module';
import { CategoryModule } from './category/category.module';
import { TransactionModule } from './transaction/transaction.module';
import { LogResponseMiddleware } from './middlewares/log-response.middleware';
import { NotificationModule } from './notification/notification.module';
import { MenteeModule } from './mentee/mentee.module';
import { RatingModule } from './rating/rating.module';
import { SocketModule } from './socket/socket.module';
import { MailModule } from './mail/mail.module';
import { ActivationModule } from './activation/activation.module';
import { ChatModule } from './chat/chat.module';
import { BlogModule } from './blog/blog.module';
import { SlugifyModule } from './slugify/slugify.module';
import { PostCategoryModule } from './post-category/post-category.module';
import { ChatSocketModule } from './chat-socket/chat-socket.module';
import { StatisticModule } from './statistic/statistic.module';
import { PaypalModule } from './paypal/paypal.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CryptoModule } from './crypto/crypto.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        authConfig,
        commonConfig,
        mailConfig,
        transactionConfig,
        paypalConfig,
      ],
    }),
    MentorModule,
    AdminModule,
    SkillModule,
    CategoryModule,
    TransactionModule,
    NotificationModule,
    MenteeModule,
    RatingModule,
    SocketModule,
    MailModule,
    ActivationModule,
    ChatModule,
    BlogModule,
    SlugifyModule,
    PostCategoryModule,
    ChatSocketModule,
    StatisticModule,
    PaypalModule,
    ScheduleModule.forRoot(),
    CryptoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LogResponseMiddleware).forRoutes('*');
  }
}
