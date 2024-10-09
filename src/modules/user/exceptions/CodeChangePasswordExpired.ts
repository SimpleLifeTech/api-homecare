import { AppHttpException } from "@shared/shared/exceptions/AppHttpException"

export class CodeChangePasswordExpired extends AppHttpException {
  constructor() {
    super({
      message: "Código expirado",
      name: CodeChangePasswordExpired.name,
    })
  }
}
