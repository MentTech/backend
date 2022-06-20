import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetRatingsQueryDto } from './dto/get-ratings-query.dto';
import JwtAuthenticationGuard from '../auth/guards/jwt-authentiacation.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';
import { AddFeaturedDto } from './dto/add-featured.dto';

@Controller('rating')
@ApiTags('Rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get multiple ratings' })
  async getRatings(@Query() query: GetRatingsQueryDto) {
    return await this.ratingService.getMultipleRating(query.ids);
  }

  @Get('/featured')
  @ApiOperation({ summary: 'Get featured ratings' })
  getFeaturedRatings() {
    return this.ratingService.getAllFeatured();
  }

  @Post('/featured')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Add to featured rating' })
  @ApiBearerAuth()
  addToFeatured(@Body() body: AddFeaturedDto) {
    return this.ratingService.addToFeatured(body.id);
  }

  @Delete('/featured/:id')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete from featured rating' })
  @ApiBearerAuth()
  deleteFromFeatured(@Param('id') id: string) {
    return this.ratingService.removeFromFeatured(+id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get rating by id' })
  getRating(@Param('id') id: string) {
    return this.ratingService.getRating(+id);
  }
}
