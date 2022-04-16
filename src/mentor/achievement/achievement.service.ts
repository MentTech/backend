import { Injectable } from '@nestjs/common';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AchievementService {
  constructor(private readonly prisma: PrismaService) {}

  create(createAchievementDto: CreateAchievementDto, mentorId: number) {
    return this.prisma.userMentor.update({
      where: { userId: mentorId },
      data: {
        achievements: {
          create: createAchievementDto,
        },
      },
      select: {
        achievements: true,
      },
    });
  }

  findAll(mentorId: number) {
    return this.prisma.achievement.findMany({
      where: {
        mentorId,
      },
    });
  }

  findOne(id: number, mentorId: number) {
    return this.prisma.achievement.findFirst({
      where: {
        id,
        mentorId,
      },
    });
  }

  update(
    id: number,
    updateAchievementDto: UpdateAchievementDto,
    mentorId?: number,
  ) {
    return this.prisma.achievement.update({
      where: {
        id,
      },
      data: updateAchievementDto,
    });
  }

  remove(id: number, mentorId?: number) {
    return this.prisma.achievement.delete({
      where: {
        id,
      },
    });
  }
}
