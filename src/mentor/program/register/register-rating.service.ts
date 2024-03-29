import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { RatingService } from '../../../rating/rating.service';

@Injectable()
export class RegisterRatingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ratingService: RatingService,
  ) {}

  async createRating(sessionId: number, rating: CreateRatingDto) {
    const existRating = await this.prisma.rating.findFirst({
      where: {
        registerId: sessionId,
      },
    });
    if (existRating) {
      throw new ConflictException('Rating already exist');
    }
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
    const rating = await this.prisma.rating.findFirst({
      where: {
        register: {
          id: sessionId,
          userId: mentee,
        },
      },
      include: {
        register: {
          include: {
            user: true,
          },
        },
      },
    });
    if (!rating) {
      throw new NotFoundException('Rating not found');
    }
    return this.ratingService.transformRating(rating);
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
