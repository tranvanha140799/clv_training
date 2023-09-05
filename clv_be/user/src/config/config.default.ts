import {
  APP_PORT,
  HASH_PASS_DIGIT,
  JWT_SECRET,
  JWT_EXP_D,
  JWT_EXP_H,
} from 'src/common/env';

export default () => ({
  APP_PORT: parseInt(APP_PORT),
  HASH_PASS_DIGIT: parseInt(HASH_PASS_DIGIT),
  JWT_SECRET,
  JWT_EXP_D,
  JWT_EXP_H,
});
