import { ArgumentsHost, Catch, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(PrismaService.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    this.logger.error(`${exception.code}: ${exception.message}`);
    switch (exception.code) {
      case 'P2000':
        response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Bad Request',
        });
        break;
      case 'P2002':
        response.status(HttpStatus.CONFLICT).json({
          status: HttpStatus.CONFLICT,
          message: 'Conflict',
        });
        break;
      case 'P2003':
        response.status(HttpStatus.NOT_FOUND).json({
          status: HttpStatus.NOT_FOUND,
          message: 'Not Found',
        });
        break;
      case 'P2025':
        response.status(HttpStatus.NOT_FOUND).json({
          status: HttpStatus.NOT_FOUND,
          message: 'Not Found',
        });
        break;
      default:
        super.catch(exception, host);
        break;
    }
  }
}
