import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message.replace(/\n/g, '');
    const request = ctx.getRequest();
    let status: any;
    let returnMessage: string;
    switch (exception.code) {
      case 'P2002': {
        status = HttpStatus.CONFLICT;
        returnMessage = message;
        break;
      }
      case 'P2025': {
        status = HttpStatus.CONFLICT;
        returnMessage =
          (exception.meta.modelName as string) +
          ' ' +
          (exception.meta.cause as string);
        break;
      }
      default:
        status = HttpStatus.BAD_REQUEST;
        returnMessage = message;
    }
    return response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: returnMessage,
    });
  }
}
