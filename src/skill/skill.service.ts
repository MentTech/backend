import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillService {
  constructor(private readonly prisma: PrismaService) {}

  create(createSkillDto: CreateSkillDto) {
    return this.prisma.skill.create({
      data: {
        description: createSkillDto.description,
      },
    });
  }

  findAll() {
    return this.prisma.skill.findMany();
  }

  findOne(id: number) {
    return this.prisma.skill.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updateSkillDto: UpdateSkillDto) {
    return this.prisma.skill.update({
      where: {
        id,
      },
      data: {
        description: updateSkillDto.description,
      },
    });
  }

  remove(id: number) {
    return this.prisma.skill.delete({
      where: {
        id,
      },
    });
  }
}
