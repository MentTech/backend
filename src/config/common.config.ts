export default () => ({
  port: process.env.PORT || '8000',
  url: {
    web: process.env.FRONT_END_URL || 'http://localhost:3000',
  },
});
