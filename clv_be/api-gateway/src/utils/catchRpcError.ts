import { HttpException } from '@nestjs/common';

export function catchRpcError(response: any) {
  if (typeof response === 'object' && response) {
    const { status, message } = response;
    if (status >= 400 && status <= 600) throw new HttpException(message, status);
  }
}
