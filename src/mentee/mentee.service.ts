import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { UserQueryPaginationDto } from '../users/dtos/user-query-pagination.dto';
import { UpdateUserDto } from '../users/dtos/update-user.dto';
import { SessionQueryDto } from '../dtos/session-query.dto';

@Injectable()
export class MenteeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UsersService,
  ) {}

  findAll(query: UserQueryPaginationDto) {
    return this.userService.findAll(query, Role.MENTEE);
  }

  findOne(id: number) {
    return this.userService.findUserByIdAndRole(id, Role.MENTEE);
  }

  update(id: number, updateMenteeDto: UpdateUserDto) {
    return this.userService.changeProfile(id, updateMenteeDto);
  }

  getMySession(id: number, query: SessionQueryDto) {
    return this.prisma.programRegister.findMany({
      where: {
        userId: id,
        isCanceled: query.isCanceled,
        isAccepted: query.isAccepted,
        done: query.done,
        expectedDate: {
          gte: query.expectedStartDate,
          lte: query.expectedEndDate,
        },
      },
      include: {
        program: true,
        rating: true,
      },
    });
  }

  async getMySessionById(menteeId: number, sessionId: number) {
    const session = await this.prisma.programRegister.findFirst({
      where: {
        userId: menteeId,
        id: sessionId,
      },
      include: {
        program: true,
        rating: true,
      },
    });
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    return session;
  }

  async getFavorites(menteeId: number) {
    const mentee = await this.prisma.menteeProfile.findFirst({
      where: {
        userId: menteeId,
      },
      select: {
        favoriteMentors: {
          select: {
            id: true,
          },
        },
      },
    });
    if (!mentee) {
      throw new NotFoundException(`Mentee with id ${menteeId} not found`);
    }
    return mentee.favoriteMentors.map((favoriteMentor) => favoriteMentor.id);
  }

  async addToFavorite(menteeId: number, mentorId: number) {
    const mentee = await this.prisma.user.findFirst({
      where: {
        id: menteeId,
        role: Role.MENTEE,
      },
    });
    if (!mentee) {
      throw new NotFoundException('Mentee not found');
    }
    const mentor = await this.prisma.user.findFirst({
      where: {
        id: mentorId,
        role: Role.MENTOR,
      },
    });
    if (!mentor) {
      throw new NotFoundException('Mentor not found');
    }
    await this.prisma.user.update({
      where: {
        id: menteeId,
      },
      data: {
        User_mentee: {
          upsert: {
            create: {
              favoriteMentors: {
                connect: {
                  id: mentorId,
                },
              },
            },
            update: {
              favoriteMentors: {
                connect: {
                  id: mentorId,
                },
              },
            },
          },
        },
      },
    });
    return 'Successfully added to favorite';
  }

  removeFromFavorite(menteeId: number, mentorId: number) {
    return this.prisma.menteeProfile.update({
      where: {
        userId: menteeId,
      },
      data: {
        favoriteMentors: {
          disconnect: {
            id: mentorId,
          },
        },
      },
    });
  }
}
