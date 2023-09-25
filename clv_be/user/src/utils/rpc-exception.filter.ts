import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RPCExceptionFilter implements RpcExceptionFilter {
  catch(exception: RpcException): Observable<any> {
    return of(exception.getError());
  }
}
