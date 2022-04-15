import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import JwtAuthenticationGuard from '../../auth/guards/jwt-authentiacation.guard';
import { Roles } from '../../decorators/roles.decorator';
import { MentorGuard } from '../../guards/mentor.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { DegreeService } from './degree.service';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';

@Controller('/mentor/:mentorId/degree')
@ApiTags('Degree')
export class DegreeController {
  constructor(private readonly degreeService: DegreeService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard, RolesGuard, MentorGuard)
  @Roles(Role.ADMIN, Role.MENTOR)
  @ApiOperation({ summary: 'Create new degree/cirtificate' })
  @ApiBearerAuth()
  create(
    @Param('mentorId') mentorId: string,
    @Body() createDegreeDto: CreateDegreeDto,
  ) {
    return this.degreeService.create(createDegreeDto, +mentorId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all degrees/cirtificates of a mentor' })
  findAll(@Param('mentorId') mentorId: string) {
    return this.degreeService.findAll(+mentorId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a degree/cirtificate of a mentor' })
  findOne(@Param('id') id: string, @Param('mentorId') mentorId: string) {
    return this.degreeService.findOne(+id, +mentorId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard, RolesGuard, MentorGuard)
  @Roles(Role.ADMIN, Role.MENTOR)
  @ApiOperation({ summary: 'Update a degrees/cirtificates of a mentor' })
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Param('mentorId') mentorId: string,
    @Body() updateDegreeDto: UpdateDegreeDto,
  ) {
    return this.degreeService.update(+id, updateDegreeDto, +mentorId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard, RolesGuard, MentorGuard)
  @Roles(Role.ADMIN, Role.MENTOR)
  @ApiOperation({ summary: 'Delete a degrees/cirtificates of a mentor' })
  @ApiBearerAuth()
  remove(@Param('id') id: string, @Param('mentorId') mentorId: string) {
    return this.degreeService.remove(+id, +mentorId);
  }
}
