import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => {
        return {
          transport: {
            host: config.get<string>('mail.smtpHost'),
            port: 465,
            secure: true,
            // auth: {
            //   type: 'OAuth2',
            //   user: config.get<string>('mail.username'),
            //   accessToken: config.get<string>('mail.accessToken'),
            //   refreshToken: config.get<string>('mail.refreshToken'),
            //   clientId: config.get<string>('google.googleClientId'),
            //   clientSecret: config.get<string>('google.googleSecret'),
            // },
            auth: {
              user: config.get<string>('mail.username'),
              pass: config.get<string>('mail.password'),
            },
          },
          defaults: {
            from: `"No Reply" <noreply@${config.get('mail.mailFrom')}>`,
          },
          template: {
            dir: process.cwd() + '/templates/',
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
