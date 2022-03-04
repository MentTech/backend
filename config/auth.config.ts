export default () => ({
  jwt: {
    jwtSecret: process.env.JWT_SECRET || 'uknawdhd8wqiadh',
    jwtExpire: parseInt(process.env.JWT_EXPIRE) || 3600,
  },
  google: {
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK,
  },
});
