import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProgramService } from './program.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '@prisma/client';
import JwtAuthenticationGuard from '../../auth/guards/jwt-authentiacation.guard';
import { MentorGuard } from '../../guards/mentor.guard';
import { ProgramResponseDto } from './dto/program-response.dto';
import { GetRatingQueryDto } from '../dtos/get-rating-query.dto';
import { PaginationResponseDto } from '../../dtos/pagination-response.dto';
import { AverageResponseDto } from '../../dtos/average-response.dto';

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
  @ApiResponse({
    status: 201,
    description: 'The program has been successfully created.',
    type: ProgramResponseDto,
  })
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
  @ApiResponse({
    status: 200,
    description: 'The programs have been successfully fetched.',
    type: [ProgramResponseDto],
  })
  findAll(@Param('mentorId') mentorId: string) {
    return this.programService.findAll(+mentorId);
  }

  @Get('/:id/rating')
  @ApiOperation({
    summary: 'Get all ratings of a program',
  })
  @ApiResponse({
    status: 200,
    description: 'The ratings have been successfully fetched.',
    type: PaginationResponseDto,
  })
  getRatings(@Param('id') id: string, @Query() query: GetRatingQueryDto) {
    return this.programService.getRatings(+id, query);
  }

  @Get('/:id/rating/average')
  @ApiOperation({
    summary: 'Get average rating of a program',
  })
  @ApiResponse({
    status: 200,
    description: 'The average rating has been successfully fetched.',
    type: AverageResponseDto,
  })
  getAverageRating(@Param('id') id: string) {
    return this.programService.averageRating(+id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a program of a mentor',
  })
  @ApiResponse({
    status: 200,
    description: 'The program has been successfully fetched.',
    type: ProgramResponseDto,
  })
  async findOne(@Param('id') id: string, @Param('mentorId') mentorId: string) {
    const program = await this.programService.findOne(+id, +mentorId);
    const averageRating = await this.programService.averageRating(+id);
    return { ...program, averageRating };
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard, MentorGuard)
  @Roles(Role.MENTOR, Role.ADMIN)
  @ApiOperation({
    summary: 'Update a program of a mentor',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The program has been successfully updated.',
    type: ProgramResponseDto,
  })
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
  @ApiResponse({
    status: 200,
    description: 'The program has been successfully deleted.',
  })
  remove(@Param('id') id: string, @Param('mentorId') mentorId: string) {
    return this.programService.remove(+id, +mentorId);
  }
}
