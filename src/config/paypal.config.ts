export default () => ({
  paypal: {
    environment: process.env.PAYPAL_ENVIRONMENT as 'sandbox' | 'live',
    clientId: process.env.PAYPAL_CLIENT_ID,
    clientSecret: process.env.PAYPAL_CLIENT_SECRET,
  },
});
