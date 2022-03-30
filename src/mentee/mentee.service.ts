import { Injectable } from '@nestjs/common';
import { CreateMenteeDto } from './dto/create-mentee.dto';
import { UpdateMenteeDto } from './dto/update-mentee.dto';
import { PrismaService } from '../prisma/prisma.service';

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
}
