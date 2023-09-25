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
  private readonly logger = new Logger('API_GATEWAY');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    this.logger.log(`BEGIN [${context.getClass().name}] ${method} ${url}`);
    const now = Date.now();
    return next.handle().pipe(
      map((data) => {
        this.logger.log(
          `END [${context.getClass().name}] ${method} ${url} ${Date.now() - now}ms`
        );
        return data;
      })
    );
  }
}
