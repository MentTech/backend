import { Injectable } from '@nestjs/common';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { GetRatingQueryDto } from '../dtos/get-rating-query.dto';
import { Prisma } from '@prisma/client';
import { PaginationResponseDto } from '../../dtos/pagination-response.dto';
import { AverageResponseDto } from '../../dtos/average-response.dto';

@Injectable()
export class ProgramService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProgramDto: CreateProgramDto, mentorId: number) {
    return this.prisma.program.create({
      data: {
        ...createProgramDto,
        mentor: {
          connect: {
            userId: mentorId,
          },
        },
      },
    });
  }

  findAll(mentorId: number) {
    return this.prisma.program.findMany({
      where: {
        mentorId,
      },
    });
  }

  findOne(id: number, mentorId: number) {
    return this.prisma.program.findFirst({
      where: {
        mentorId,
        id,
      },
    });
  }

  update(id: number, updateProgramDto: UpdateProgramDto, mentorId: number) {
    return this.prisma.program.update({
      where: { id },
      data: updateProgramDto,
    });
  }

  remove(id: number, mentorId: number) {
    return this.prisma.program.delete({
      where: {
        id,
      },
    });
  }

  async getRatings(programId: number, query: GetRatingQueryDto) {
    const { page, limit } = query;
    const ratingWhereInput: Prisma.RatingWhereInput = {
      register: {
        program: {
          id: programId,
        },
      },
    };

    const count = await this.prisma.rating.count({
      where: ratingWhereInput,
    });

    const totalPage = Math.ceil(count / limit);

    const filteredRating = await this.prisma.rating.findMany({
      where: ratingWhereInput,
      take: limit,
      skip: (page - 1) * limit,
    });

    const res = {
      page,
      totalPage,
      limit,
      data: filteredRating,
    };
    return new PaginationResponseDto(res);
  }

  async averageRating(programId: number) {
    const count = await this.prisma.rating.count({
      where: {
        register: {
          program: {
            id: programId,
          },
        },
      },
    });
    if (count === 0) {
      return new AverageResponseDto({
        average: 0,
        count,
      });
    }
    const avg = await this.prisma.rating.aggregate({
      where: {
        register: {
          program: {
            id: programId,
          },
        },
      },
      _avg: {
        rating: true,
      },
    });
    return new AverageResponseDto({
      count,
      average: avg._avg.rating,
    });
  }
}
