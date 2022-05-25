import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class SuccesseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const statusCode: Response = context
      .switchToHttp()
      .getResponse().statusCode;

    return next.handle().pipe(
      map((data) => ({
        success: true,
        msg: data.msg,
        response: data.response,
        statusCode,
      })),
    );
  }
}
