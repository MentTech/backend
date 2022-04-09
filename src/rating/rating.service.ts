import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, ProgramRegister, Rating, User } from '@prisma/client';
import { GetRatingQueryDto } from '../mentor/dtos/get-rating-query.dto';
import * as _ from 'lodash';
import { PaginationResponseDto } from '../dtos/pagination-response.dto';

export type RatingType = Omit<Rating, 'register'> & {
  user: Pick<User, 'name' | 'avatar'>;
};

@Injectable()
export class RatingService {
  constructor(private readonly prisma: PrismaService) {}

  async getRatingsPagination(
    where: Prisma.RatingWhereInput,
    query: GetRatingQueryDto,
  ): Promise<PaginationResponseDto<RatingType>> {
    const { page, limit } = query;

    const count = await this.prisma.rating.count({
      where,
    });

    const totalPage = Math.ceil(count / limit);

    const filteredRating = await this.prisma.rating.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      include: {
        register: {
          include: {
            user: true,
          },
        },
      },
    });

    const returnRating = filteredRating.map((rating) =>
      this.transformRating(rating),
    );

    const res = {
      page,
      totalPage,
      limit,
      data: returnRating,
    };
    return new PaginationResponseDto<RatingType>(res);
  }

  transformRating(
    rating: Rating & { register: ProgramRegister & { user: User } },
  ): RatingType {
    const transformed = _.omit(rating, 'register');
    const user = _.pick(rating.register.user, ['name', 'avatar']);
    return {
      ...transformed,
      user,
    };
  }
}
