import {IsNumber} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class AddFavoriteDto {
  @IsNumber()
  @ApiProperty({
    description: 'Mentee id',
    example: 1,
  })
  mentorId: number;
}