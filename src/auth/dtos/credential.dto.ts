import { IsEmail, IsString, Max, Min } from 'class-validator';

export class CredentialDto {
  @IsEmail()
  email: string;

  @IsString()
  @Min(6)
  @Max(50)
  password: string;
}
