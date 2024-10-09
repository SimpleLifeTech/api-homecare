import { AppHttpException } from "@shared/shared/exceptions/AppHttpException"
import { HttpStatus } from "@nestjs/common"

export class UserNotFound extends AppHttpException {
  constructor() {
    super({
      message: "Usuário não existe",
      httpCode: HttpStatus.NOT_FOUND,
      code: UserNotFound.name,
    })
  }
}
