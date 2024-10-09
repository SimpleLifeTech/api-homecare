import { AppHttpException } from "@shared/shared/exceptions/AppHttpException"

export class CodeChangePasswordNotFound extends AppHttpException {
  constructor() {
    super({
      message: "Código não encontrado",
      name: CodeChangePasswordNotFound.name,
    })
  }
}
