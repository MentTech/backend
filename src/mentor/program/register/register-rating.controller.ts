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
import { RegisterRatingService } from './register-rating.service';
import { SessionMenteeGuard } from '../../../guards/session-mentee.guard';
import { CreateRatingDto } from './dto/create-rating.dto';
import { GetUser } from '../../../decorators/get-user.decorator';
import JwtAuthenticationGuard from '../../../auth/guards/jwt-authentiacation.guard';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Controller('mentor/:mentorId/program/:programId/register/:sessionId/rating')
@UseGuards(JwtAuthenticationGuard, SessionMenteeGuard)
@ApiTags('Program register')
@ApiBearerAuth()
export class RegisterRatingController {
  constructor(private readonly registerRatingService: RegisterRatingService) {}

  @Post('/')
  @ApiOperation({ summary: 'Create rating' })
  createRating(
    @Param('sessionId') sessionId: string,
    @Body() body: CreateRatingDto,
  ) {
    return this.registerRatingService.createRating(+sessionId, body);
  }

  @Get('/')
  @ApiOperation({ summary: 'Get rating' })
  getRatings(@Param('sessionId') sessionId: string, @GetUser() user) {
    return this.registerRatingService.getRatings(+sessionId, user.id);
  }

  @Patch('/:ratingId')
  @ApiOperation({ summary: 'Update rating' })
  updateRating(
    @Param('sessionId') sessionId: string,
    @Param('ratingId') ratingId: string,
    @Body() body: UpdateRatingDto,
  ) {
    return this.registerRatingService.updateRating(+sessionId, +ratingId, body);
  }

  @Delete('/:ratingId')
  @ApiOperation({ summary: 'Delete rating' })
  deleteRating(
    @Param('sessionId') sessionId: string,
    @Param('ratingId') ratingId: string,
  ) {
    return this.registerRatingService.deleteRating(+sessionId, +ratingId);
  }
}
