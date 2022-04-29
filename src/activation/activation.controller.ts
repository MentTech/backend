import { Body, Controller, Param, Post } from '@nestjs/common';
import { ActivationService } from './activation.service';
import { ResendActiveEmailDto } from './dto/resend-active-email.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('activation')
@ApiTags('Activation')
export class ActivationController {
  constructor(private readonly activationService: ActivationService) {}

  @Post('/resend')
  @ApiOperation({ summary: 'Resend activation email' })
  resendActivationEmail(@Body() body: ResendActiveEmailDto) {
    return this.activationService.resendActivationEmail(body.email);
  }

  @Post('/:token')
  @ApiOperation({ summary: 'Activate user' })
  activateAccount(@Param('token') token: string) {
    return this.activationService.activateAccount(token);
  }
}
