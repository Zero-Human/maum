import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
  InternalServerErrorException,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';

@Catch()
export class AllExceptionFiller implements ExceptionFilter, GqlExceptionFilter {
  constructor(@Inject(Logger) private readonly logger: LoggerService) {}
  catch(exception: Error, host: ArgumentsHost) {
    const callstack = exception.stack;
    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException(['Internal Server Error']);
    }

    const response = (exception as HttpException).getResponse();

    const log = {
      response,
      timestamp: new Date().toLocaleString(),
    };
    this.logger.error(
      `${log.timestamp} ${exception.name}`,
      callstack,
      'AllExceptionFiller',
    );
    return exception;
  }
}
