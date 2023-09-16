import { config } from 'dotenv';

config();

export const POSTGRES_HOST: string = process.env.POSTGRES_HOST;
export const POSTGRES_PORT: string = process.env.POSTGRES_PORT;
export const POSTGRES_USER: string = process.env.POSTGRES_USER;
export const POSTGRES_PASSWORD: string = process.env.POSTGRES_PASSWORD;
export const POSTGRES_DB: string = process.env.POSTGRES_DB;
export const POSTGRES_DB_NAME: string = process.env.POSTGRES_DB_NAME;

export const APP_DOMAIN: string = process.env.APP_DOMAIN;
export const GATEWAY_PORT: string = process.env.GATEWAY_PORT;
export const USER_PORT: string = process.env.USER_PORT;
export const FE_PORT = process.env.FE_PORT;

export const JWT_SECRET: string = process.env.JWT_SECRET;
export const APP_EXPIRES: string = process.env.APP_EXPIRES;
export const HASH_PASS_DIGIT: string = process.env.HASH_PASS_DIGIT;
export const JWT_EXP_D: string = process.env.JWT_EXP_D;
export const JWT_EXP_H: string = process.env.JWT_EXP_H;
export const PGADMIN_LISTEN_PORT: string = process.env.PGADMIN_LISTEN_PORT;
export const APP_PORT: string = process.env.APP_PORT;

export const OAUTH_GOOGLE_CLIENT_ID: string =
  process.env.OAUTH_GOOGLE_CLIENT_ID;
export const OAUTH_GOOGLE_SECRET: string = process.env.OAUTH_GOOGLE_SECRET;
export const OAUTH_GOOGLE_REDIRECT: string = process.env.OAUTH_GOOGLE_REDIRECT;
export const AUTH_RESET_PASSWORD_URL: string =
  process.env.AUTH_RESET_PASSWORD_URL;

export const KAFKA_BROKER_ID = process.env.KAFKA_BROKER_ID;
export const KAFKA_GATEWAY_CLIENT_ID = process.env.KAFKA_GATEWAY_CLIENT_ID;
export const KAFKA_NOTIFICATION_CLIENT_ID =
  process.env.KAFKA_NOTIFICATION_CLIENT_ID;
export const KAFKA_GATEWAY_CONSUMER_GROUP_ID =
  process.env.KAFKA_GATEWAY_CONSUMER_GROUP_ID;
export const KAFKA_NOTIFICATION_CONSUMER_GROUP_ID =
  process.env.KAFKA_NOTIFICATION_CONSUMER_GROUP_ID;
export const KAFKA_USER_CONSUMER_GROUP_ID =
  process.env.KAFKA_USER_CONSUMER_GROUP_ID;

export const REDIS_PORT = process.env.REDIS_PORT;
export const REDIS_RESET_PW_MAIL_EXPIRE_TIME =
  process.env.REDIS_RESET_PW_MAIL_EXPIRE_TIME;
export const REDIS_NEW_PW_MAIL_EXPIRE_TIME =
  process.env.REDIS_NEW_PW_MAIL_EXPIRE_TIME;
