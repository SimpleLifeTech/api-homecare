import { AppHttpException } from "@shared/shared/exceptions/AppHttpException"

export class CodePhoneConfirmationNotFound extends AppHttpException {
  constructor() {
    super({
      message: "Código não encontrado",
      name: CodePhoneConfirmationNotFound.name,
    })
  }
}
