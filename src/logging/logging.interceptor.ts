import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;
        const request = context.switchToHttp().getRequest();
        const { method, url, ip } = request;
        this.logger.log(`[${method}] ${url} ${ip} - Took ${responseTime}ms`);
      }),
    );
  }
}
