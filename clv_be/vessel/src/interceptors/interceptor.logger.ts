import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    // console.log(
    //   '🚀 -> file: interceptor.logger.ts:14 -> LoggerInterceptor -> intercept -> req:',
    //   req,
    // );
    const method = request.method;
    const url = request.url;
    Logger.log(`BEGIN [${context.getClass().name}] ${method} ${url}`);
    const now = Date.now();
    return next.handle().pipe(
      map((data) => {
        Logger.log(
          `END [${context.getClass().name}] ${method} ${url} ${
            Date.now() - now
          }ms`,
        );
        return data;
      }),
    );
  }
}
