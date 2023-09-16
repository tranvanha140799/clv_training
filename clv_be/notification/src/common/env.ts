import { config } from 'dotenv';

config();

export const APP_DOMAIN = process.env.APP_DOMAIN;
export const GATEWAY_PORT = process.env.GATEWAY_PORT;
export const NOTIFICATION_PORT = process.env.NOTIFICATION_PORT;
export const FE_PORT = process.env.FE_PORT;

export const EMAIL_HOST = process.env.EMAIL_HOST;
export const EMAIL_PORT = process.env.EMAIL_PORT;
export const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

export const OAUTH_GOOGLE_CLIENT_ID = process.env.OAUTH_GOOGLE_CLIENT_ID;
export const OAUTH_GOOGLE_SECRET = process.env.OAUTH_GOOGLE_SECRET;
export const OAUTH_GOOGLE_REDIRECT = process.env.OAUTH_GOOGLE_REDIRECT;
export const GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL;
export const EMAIL_ACCOUNT = process.env.EMAIL_ACCOUNT;
export const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = process.env.REDIS_PORT;

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
