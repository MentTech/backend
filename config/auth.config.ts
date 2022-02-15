export default () => ({
  jwt: {
    jwtSecret: process.env.JWT_SECRET || 'uknawdhd8wqiadh',
    jwtExpire: parseInt(process.env.JWT_EXPIRE) || 3600,
  },
});
