import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';

@Injectable()
export class DegreeService {
  constructor(private readonly prisma: PrismaService) {}

  create(createDegreeDto: CreateDegreeDto, mentorId: number) {
    return this.prisma.userMentor.update({
      where: { userId: mentorId },
      data: {
        degree: {
          create: createDegreeDto,
        },
      },
    });
  }

  findAll(mentorId: number) {
    return this.prisma.degree.findMany({
      where: {
        mentorId,
      },
    });
  }

  findOne(id: number, mentorId: number) {
    return this.prisma.degree.findFirst({
      where: {
        mentorId,
        id,
      },
    });
  }

  update(id: number, updateDegreeDto: UpdateDegreeDto, mentorId?: number) {
    return this.prisma.degree.update({
      where: {
        id,
      },
      data: updateDegreeDto,
    });
  }

  remove(id: number, mentorId?: number) {
    return this.prisma.degree.delete({
      where: {
        id,
      },
    });
  }
}
