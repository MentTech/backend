import {Type} from "class-transformer";
import {ApiPropertyOptional} from "@nestjs/swagger";

export class SuggestQueryDto {
  @ApiPropertyOptional({
    default: 5,
  })
  @Type(() => Number)
  num: number = 5;
}