import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status: number;
    let errorMessage: string;

    // Erros HTTP já tratados
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      errorMessage = typeof res === "string" ? res : (res as any)?.message || "Erro desconhecido";
      this.logger.error("Erro HTTP capturado", exception);
    }
    // Erros do Prisma
    else if (
      exception instanceof Prisma.PrismaClientKnownRequestError ||
      exception instanceof Prisma.PrismaClientValidationError ||
      exception instanceof Prisma.PrismaClientUnknownRequestError
    ) {
      status = HttpStatus.BAD_REQUEST;
      errorMessage = "Erro ao processar a requisição";
      this.logger.error("Erro Prisma capturado", exception);
    }
    // Qualquer outro erro inesperado
    else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorMessage = "Erro interno ao processar a requisição";
      this.logger.error("Erro inesperado capturado", exception);
    }

    // Retorno genérico para o front
    response.status(status).json({
      status: status < 500,
      data: null,
      error: errorMessage,
    });
  }
}
