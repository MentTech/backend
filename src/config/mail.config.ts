export default () => ({
  mail: {
    smtpHost: process.env.MAIL_SMTP_HOST || 'smtp.example.com',
    username: process.env.MAIL_USERNAME || 'username',
    password: process.env.MAIL_PASSWORD || 'password',
    mailFrom: process.env.MAIL_FROM || 'example@email.com',
    accessToken: process.env.GOOGLE_ACCESS_TOKEN || 'accessToken',
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN || 'refreshToken',
  },
});
