import { HttpException, HttpStatus } from "@nestjs/common";

type Payload = {
  message: string;
  code?: string;
  httpCode?: HttpStatus;
  shouldReport?: boolean;
} & Record<string, any>;

export class AppHttpException extends HttpException {
  public shouldReport = true;

  constructor({ httpCode = HttpStatus.BAD_REQUEST, shouldReport = true, ...rest }: Payload) {
    super(rest, httpCode);

    this.shouldReport = shouldReport;
  }
}
