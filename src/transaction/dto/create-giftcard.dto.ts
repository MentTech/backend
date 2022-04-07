import { IsDate, IsInt, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGiftCardDto {
  @IsString()
  type: string;

  @IsDate()
  @Type(() => Date)
  validFrom: Date = new Date();

  @IsDate()
  @Type(() => Date)
  validTo: Date;

  @IsNumber()
  usageLeft: number = 1;

  @IsInt()
  coin: number;
}
