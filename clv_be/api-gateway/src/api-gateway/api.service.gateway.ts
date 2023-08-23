import { APP_DOMAIN } from '../common/app.constants';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ServiceMapping as PortServiceMapping } from '../utils';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Request } from 'express';

export class ApiGatewayService {
  constructor() {}
  private logger: Logger = new Logger('CLV API Gateway');

  //* Redirect to other route
  async redirectRequest(request: Request): Promise<any> {
    const PORT: string = PortServiceMapping(request.url);
    // Ignore serviceName and path from request
    const { serviceName, path, ...params } = request.params;

    const apiUrl = APP_DOMAIN + PORT + request.url;
    this.logger.log(`[Redirect to] [${request.method}] ${apiUrl}`);

    const requestConfig = {
      url: apiUrl,
      method: request.method,
      params: params || {},
      data: request.body || {},
      headers: request.headers || {},
    };
    console.log(
      '🚀 -> file: api.service.gateway.ts:32 -> ApiGatewayService -> redirectRequest -> requestConfig.headers:',
      requestConfig.headers
    );
    console.log(
      '🚀 -> file: api.service.gateway.ts:32 -> ApiGatewayService -> redirectRequest -> request.headers:',
      request.headers
    );

    try {
      const response: AxiosResponse = await axios(requestConfig);

      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    } catch (error) {
      this.logger.error(error.message);
      // console.log('Error: ', error?.response?.data?.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
