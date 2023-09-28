import { config } from 'dotenv';

config();

export const POSTGRES_HOST: string = process.env.POSTGRES_HOST;
export const POSTGRES_PORT: string = process.env.POSTGRES_PORT;
export const POSTGRES_USER: string = process.env.POSTGRES_USER;
export const POSTGRES_PASSWORD: string = process.env.POSTGRES_PASSWORD;
export const POSTGRES_DB: string = process.env.POSTGRES_DB;
export const POSTGRES_DB_NAME: string = process.env.POSTGRES_DB_NAME;
