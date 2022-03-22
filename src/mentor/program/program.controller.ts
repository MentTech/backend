import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProgramService } from './program.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '@prisma/client';
import JwtAuthenticationGuard from '../../auth/guards/jwt-authentiacation.guard';
import { MentorGuard } from '../../guards/mentor.guard';

@Controller('mentor/:mentorId/program')
@ApiTags('Mentoring program')
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard, MentorGuard)
  @Roles(Role.MENTOR, Role.ADMIN)
  @ApiOperation({
    summary: 'Create new program',
  })
  @ApiBearerAuth()
  create(
    @Param('mentorId') mentorId: string,
    @Body() createProgramDto: CreateProgramDto,
  ) {
    return this.programService.create(createProgramDto, +mentorId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all programs of a mentor',
  })
  findAll(@Param('mentorId') mentorId: string) {
    return this.programService.findAll(+mentorId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a program of a mentor',
  })
  findOne(@Param('id') id: string, @Param('mentorId') mentorId: string) {
    return this.programService.findOne(+id, +mentorId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard, MentorGuard)
  @Roles(Role.MENTOR, Role.ADMIN)
  @ApiOperation({
    summary: 'Update a program of a mentor',
  })
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Param('mentorId') mentorId: string,
    @Body() updateProgramDto: UpdateProgramDto,
  ) {
    return this.programService.update(+id, updateProgramDto, +mentorId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard, MentorGuard)
  @Roles(Role.MENTOR, Role.ADMIN)
  @ApiOperation({
    summary: 'Delete a program of a mentor',
  })
  @ApiBearerAuth()
  remove(@Param('id') id: string, @Param('mentorId') mentorId: string) {
    return this.programService.remove(+id, +mentorId);
  }
}
