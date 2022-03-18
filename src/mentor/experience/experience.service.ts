import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Injectable()
export class ExperienceService {
  constructor(private readonly prisma: PrismaService) {}

  create(createExperienceDto: CreateExperienceDto, mentorId: number) {
    return this.prisma.userMentor.update({
      where: { userId: mentorId },
      data: {
        experiences: {
          create: createExperienceDto,
        },
      },
      select: {
        experiences: true,
      },
    });
  }

  findAll(mentorId: number) {
    return this.prisma.experience.findMany({
      where: {
        mentorId,
      },
    });
  }

  findOne(id: number, mentorId: number) {
    return this.prisma.experience.findFirst({
      where: {
        id,
        mentorId,
      },
    });
  }

  update(
    id: number,
    updateExperienceDto: UpdateExperienceDto,
    mentorId: number,
  ) {
    return this.prisma.experience.update({
      where: {
        id,
      },
      data: updateExperienceDto,
    });
  }

  remove(id: number, mentorId: number) {
    return this.prisma.experience.delete({
      where: {
        id,
      },
    });
  }
}
