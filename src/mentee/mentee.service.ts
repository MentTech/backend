import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMenteeDto } from './dto/create-mentee.dto';
import { UpdateMenteeDto } from './dto/update-mentee.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class MenteeService {
  constructor(private readonly prisma: PrismaService) {}

  create(createMenteeDto: CreateMenteeDto) {
    return 'This action adds a new mentee';
  }

  findAll() {
    return `This action returns all mentee`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mentee`;
  }

  update(id: number, updateMenteeDto: UpdateMenteeDto) {
    return `This action updates a #${id} mentee`;
  }

  remove(id: number) {
    return `This action removes a #${id} mentee`;
  }

  getMySession(id: number) {
    return this.prisma.programRegister.findMany({
      where: {
        userId: id,
      },
      include: {
        program: true,
        rating: true,
      },
    });
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
