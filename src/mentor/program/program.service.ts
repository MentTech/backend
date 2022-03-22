import { Injectable } from '@nestjs/common';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProgramService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProgramDto: CreateProgramDto, mentorId: number) {
    return this.prisma.userMentor.update({
      where: {
        userId: mentorId,
      },
      data: {
        programs: {
          create: createProgramDto,
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
}
