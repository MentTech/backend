import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Injectable()
export class RegisterRatingService {
  constructor(private readonly prisma: PrismaService) {}

  async createRating(sessionId: number, rating: CreateRatingDto) {
    return this.prisma.rating.create({
      data: {
        ...rating,
        register: {
          connect: {
            id: sessionId,
          },
        },
      },
    });
  }

  async getRatings(sessionId: number, mentee: number) {
    return this.prisma.rating.findMany({
      where: {
        register: {
          id: sessionId,
          userId: mentee,
        },
      },
    });
  }

  async updateRating(
    sessionId: number,
    ratingId: number,
    rating: UpdateRatingDto,
  ) {
    const ratingE = await this.prisma.rating.findFirst({
      where: {
        id: ratingId,
        register: {
          id: sessionId,
        },
      },
    });
    if (!ratingE) {
      throw new NotFoundException(`Rating with id ${ratingId} not found`);
    }
    return this.prisma.rating.update({
      where: {
        id: ratingId,
      },
      data: {
        ...rating,
      },
    });
  }

  async deleteRating(sessionId: number, ratingId: number) {
    const rating = await this.prisma.rating.findFirst({
      where: {
        id: ratingId,
        register: {
          id: sessionId,
        },
      },
    });
    if (!rating) {
      throw new NotFoundException(`Rating with id ${ratingId} not found`);
    }
    return this.prisma.rating.delete({
      where: {
        id: ratingId,
      },
    });
  }
}
