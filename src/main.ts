import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as basicAuth from 'express-basic-auth';
import { PrismaClientExceptionFilter } from './filters/prisma-client-exception.filter';
import helmet from 'helmet';

const setup = (app: INestApplication) => {
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.enableCors();
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  app.use(
    ['/v1/docs'],
    basicAuth({
      challenge: true,
      users: {
        admin: 'password',
      },
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Jett')
    .setDescription('The Jett API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('v1/docs', app, document);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setup(app);
  const config = app.get(ConfigService);
  const port = config.get<string>('port');
  await app.listen(port, '0.0.0.0');
}

bootstrap();
