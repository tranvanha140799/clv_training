import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  //* Create interceptor to allow Expose decorator to show willing properties
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    return next.handle().pipe(map((data) => data));
  }
}
