import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    switch (exception.code) {
      case 11000:
        // duplicate exception
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        return response.status(400).json('User with this email already exist');
    }
  }
}
