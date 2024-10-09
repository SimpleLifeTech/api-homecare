import { AppHttpException } from "@shared/shared/exceptions/AppHttpException"

export class CodeEmailConfirmationNotFound extends AppHttpException {
  constructor() {
    super({
      message: "Código não encontrado",
      name: CodeEmailConfirmationNotFound.name,
    })
  }
}
