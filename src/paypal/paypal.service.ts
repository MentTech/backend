import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as paypalSdk from 'paypal-rest-sdk';

@Injectable()
export class PaypalService {
  private readonly paypal = paypalSdk;

  constructor(@Inject(ConfigService) config: ConfigService) {
    this.paypal.configure({
      mode: config.get('paypal.environment'),
      client_id: config.get('paypal.clientId'),
      client_secret: config.get('paypal.clientSecret'),
    });
  }

  getPaypal() {
    return this.paypal;
  }
}
