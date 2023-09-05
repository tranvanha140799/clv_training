import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class ExceptionFilterRpc implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    console.log(
      '🚀 -> file: rpc-exception.filter.ts:8 -> ExceptionFilterRpc -> exception:',
      exception,
    );
    console.log(
      '🚀 -> file: rpc-exception.filter.ts:9 -> ExceptionFilterRpc -> host:',
      host,
    );
    return throwError(() => exception.getError());
  }
}
