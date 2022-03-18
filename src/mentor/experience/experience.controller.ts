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
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '@prisma/client';
import JwtAuthenticationGuard from '../../auth/guards/jwt-authentiacation.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { MentorGuard } from '../../guards/mentor.guard';

@Controller('mentor/:mentorId/experience')
@ApiTags('Experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard, RolesGuard, MentorGuard)
  @Roles(Role.ADMIN, Role.MENTOR)
  @ApiOperation({ summary: 'Create a new experience of a mentor' })
  @ApiBearerAuth()
  create(
    @Param('mentorId') mentorId: string,
    @Body() createExperienceDto: CreateExperienceDto,
  ) {
    return this.experienceService.create(createExperienceDto, +mentorId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all experiences of a mentor' })
  findAll(@Param('mentorId') mentorId: string) {
    return this.experienceService.findAll(+mentorId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a experience of a mentor' })
  findOne(@Param('id') id: string, @Param('mentorId') mentorId: string) {
    return this.experienceService.findOne(+id, +mentorId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard, RolesGuard, MentorGuard)
  @Roles(Role.ADMIN, Role.MENTOR)
  @ApiOperation({ summary: 'Update a experience of a mentor' })
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Param('mentorId') mentorId: string,
    @Body() updateExperienceDto: UpdateExperienceDto,
  ) {
    return this.experienceService.update(+id, updateExperienceDto, +mentorId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard, RolesGuard, MentorGuard)
  @Roles(Role.ADMIN, Role.MENTOR)
  @ApiOperation({ summary: 'Delete a experience of a mentor' })
  @ApiBearerAuth()
  remove(@Param('id') id: string, @Param('mentorId') mentorId: string) {
    return this.experienceService.remove(+id, +mentorId);
  }
}
