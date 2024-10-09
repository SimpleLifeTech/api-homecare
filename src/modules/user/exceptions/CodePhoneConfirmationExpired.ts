import { AppHttpException } from "@shared/shared/exceptions/AppHttpException"

export class CodePhoneConfirmationExpired extends AppHttpException {
  constructor() {
    super({
      message: "Código expirado",
      name: CodePhoneConfirmationExpired.name,
    })
  }
}
