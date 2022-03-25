import { ApiProperty } from '@nestjs/swagger';

export class AcceptSessionDto {
  @ApiProperty()
  contactInfo: string;
}
