import {
  Catch,
  RpcExceptionFilter,
  ArgumentsHost,
  ExecutionContext,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

// @Catch(RpcException)
// export class RPCExceptionFilter implements RpcExceptionFilter<RpcException> {
//   catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();
//     const res: any = exception.getError();
//     const status = exception.getError();

//     // response.status(status).json({
//     //   statusCode: status,
//     //   path: request.url,
//     //   message: typeof res.message === 'object' ? res.message[0] : res.message || res,
//     // });
//     console.log(
//       '🚀 -> file: exception.filter.ts:7 -> ExceptionFilter -> exception.getError():',
//       exception
//     );
//     console.log(
//       '🚀 -> file: rpc-exception.filter.ts:7 -> ExceptionFilter -> host:',
//       host
//     );
//     return throwError(() => exception.stack);
//   }
// }

@Catch(RpcException)
export class RPCExceptionFilter implements RpcExceptionFilter {
  catch(exception: RpcException, context: ExecutionContext): Observable<any> {
    const response = context.switchToRpc(); // Lấy đối tượng response
    console.log(
      '🚀 -> file: rpc-exception.filter.ts:40 -> RPCExceptionFilter -> response:',
      response
    );

    // Kiểm tra loại ngoại lệ và xử lý tùy theo nhu cầu của bạn
    if (exception instanceof RpcException) {
      console.log(
        '🚀 -> file: rpc-exception.filter.ts:43 -> RPCExceptionFilter -> exception:',
        exception.getError()
      );
      const errorResponse = {
        statusCode: exception.getError(), // Mã lỗi tùy theo ngoại lệ
        message: exception.getError() || 'Internal server error', // Thông điệp lỗi
      };
      // response(exception.getError()).send(errorResponse); // Gửi phản hồi với mã lỗi và thông điệp
    }

    // Trả về một Observable trống hoặc giá trị khác nếu cần
    return throwError(() => exception.getError()); // Hoặc return Observable.of({}); nếu bạn muốn trả về một giá trị rỗng
  }
}
