export default () => ({
  APP_PORT: parseInt(process.env.PORT),
  HASH_PASS_DIGIT: 10,
  JWT_SECRET: 'uthinkucanguessit',
  JWT_EXP_D: '1d',
  JWT_EXP_H: '3600s',
});
