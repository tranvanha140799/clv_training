import { config } from 'dotenv';
import { FE_PORT, GATEWAY_PORT } from 'src/common/env';

config();

export const CorsOptions = {
  origin: [`http://localhost:${GATEWAY_PORT}`, `http://localhost:${FE_PORT}`],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};
