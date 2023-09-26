import { ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { LoggerInterceptor, TransformInterceptor } from '../interceptors';
import { HttpExceptionFilter } from 'src/utils';

export const providers = [
  {
    provide: APP_INTERCEPTOR,
    useClass: TransformInterceptor,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: LoggerInterceptor,
  },
  {
    provide: APP_PIPE,
    useClass: ValidationPipe,
  },
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  },
];
