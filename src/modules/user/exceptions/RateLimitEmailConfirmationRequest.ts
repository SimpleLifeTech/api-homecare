import { AppHttpException } from "@shared/shared/exceptions/AppHttpException"
import { HttpStatus } from "@nestjs/common"

export class RateLimitEmailConfirmationRequest extends AppHttpException {
  constructor() {
    super({
      httpCode: HttpStatus.TOO_MANY_REQUESTS,
      message: "Houve uma solicitação há pouco. Aguarde alguns segundos e tente novamente.",
      code: RateLimitEmailConfirmationRequest.name,
    })
  }
}
