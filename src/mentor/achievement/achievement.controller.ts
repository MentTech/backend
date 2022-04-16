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
import { AchievementService } from './achievement.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from '../../auth/guards/jwt-authentiacation.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { MentorGuard } from '../../guards/mentor.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('/mentor/:mentorId/achievement')
@ApiTags('Achievement')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard, RolesGuard, MentorGuard)
  @Roles(Role.ADMIN, Role.MENTOR)
  @ApiOperation({ summary: 'Create achievement' })
  @ApiBearerAuth()
  create(
    @Param('mentorId') mentorId: string,
    @Body() createAchievementDto: CreateAchievementDto,
  ) {
    return this.achievementService.create(createAchievementDto, +mentorId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all achievements' })
  findAll(@Param('mentorId') mentorId: string) {
    return this.achievementService.findAll(+mentorId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get achievement by id' })
  findOne(@Param('id') id: string, @Param('mentorId') mentorId: string) {
    return this.achievementService.findOne(+id, +mentorId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard, RolesGuard, MentorGuard)
  @Roles(Role.ADMIN, Role.MENTOR)
  @ApiOperation({ summary: 'Update achievement' })
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Param('mentorId') mentorId: string,
    @Body() updateAchievementDto: UpdateAchievementDto,
  ) {
    return this.achievementService.update(+id, updateAchievementDto, +mentorId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard, RolesGuard, MentorGuard)
  @Roles(Role.ADMIN, Role.MENTOR)
  @ApiOperation({ summary: 'Delete achievement' })
  @ApiBearerAuth()
  remove(@Param('id') id: string, @Param('mentorId') mentorId: string) {
    return this.achievementService.remove(+id, +mentorId);
  }
}
