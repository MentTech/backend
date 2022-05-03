import { OmitType } from '@nestjs/swagger';
import { SearchPostsDto } from './search-posts.dto';

export class SearchOwnerPostsDto extends OmitType(SearchPostsDto, [
  'authorId',
]) {}
