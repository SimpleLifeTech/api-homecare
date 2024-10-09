import { AppHttpException } from "@shared/shared/exceptions/AppHttpException"

export class CodeEmailConfirmationExpired extends AppHttpException {
  constructor() {
    super({
      message: "Código expirado",
      name: CodeEmailConfirmationExpired.name,
    })
  }
}
