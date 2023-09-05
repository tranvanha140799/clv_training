// import {
//   ArgumentsHost,
//   Catch,
//   ExceptionFilter,
//   HttpException,
//   HttpStatus,
// } from '@nestjs/common';
// import { RpcException } from '@nestjs/microservices';
// import { Response } from 'express';

// @Catch(RpcException)
// export class RpcExceptionToHttpExceptionFilter implements ExceptionFilter {
//   catch(exception: RpcException, host: ArgumentsHost) {
//     console.log(
//       '🚀 -> file: exception.filter.ts:7 -> HttpExceptionFilter -> exception:',
//       exception
//     );
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     console.log(
//       '🚀 -> file: exception.filter.ts:9 -> HttpExceptionFilter -> response:',
//       response
//     );
//     const request = ctx.getRequest<Request>();
//     // const res: any = exception.getResponse();
//     const res = { message: [] };
//     // Custom later
//     const status = HttpStatus.BAD_REQUEST;

//     response.status(status).json({
//       statusCode: status,
//       path: request.url,
//       message: typeof res.message === 'object' ? res.message[0] : res.message || res,
//     });
//   }
// }

import { Catch, ArgumentsHost, HttpStatus, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch(RpcException)
export class RpcExceptionToHttpExceptionFilter
  implements RpcExceptionFilter<RpcException>
{
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    // const ctx = host.switchToHttp();
    // const response = ctx.getResponse();

    // // You can further customize the status code and the response based on the exception message or error code
    // const status = HttpStatus.BAD_REQUEST;

    // response.status(status).json({
    //   statusCode: status,
    //   message: exception.message,
    // });
    return throwError(() => exception.getError());
  }
}
