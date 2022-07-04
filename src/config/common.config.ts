export default () => ({
  port: process.env.PORT || '8000',
  url: {
    web: process.env.FRONT_END_URL || 'http://localhost:3000',
  },
  nodeEnvironment: process.env.NODE_ENV || 'development',
  ekycPublicKey: process.env.EKYC_PUBLIC_KEY || '',
});
