import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from "express";

import { MyLogger } from "../log/logger.logs";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const logger = new MyLogger();

    const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = exception.getResponse ? exception.getResponse() : null;

    if (!message) {
      const errorResponse = {
        status: false,
        data: null,
        error: exception.message || "Internal server error",
      };

      logger.error(errorResponse.error, String(status));
      message = errorResponse;
    }

    response.status(status).json(message);
  }
}
