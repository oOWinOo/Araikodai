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
