import { Controller, Get, Param, Query } from '@nestjs/common';
import { RatingService } from './rating.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetRatingsQueryDto } from './dto/get-ratings-query.dto';

@Controller('rating')
@ApiTags('Rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get multiple ratings' })
  async getRatings(@Query() query: GetRatingsQueryDto) {
    return await this.ratingService.getMultipleRating(query.ids);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get rating by id' })
  getRating(@Param('id') id: string) {
    return this.ratingService.getRating(+id);
  }
}
