import { AcceptSessionDto } from './accept-session.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateSessionDto extends PartialType(AcceptSessionDto) {}
