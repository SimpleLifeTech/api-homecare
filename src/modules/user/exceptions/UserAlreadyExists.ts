import { AppHttpException } from "@shared/shared/exceptions/AppHttpException"

export class UserAlreadyExists extends AppHttpException {
  constructor() {
    super({
      message: "Usuário já possui cadastro na nossa base",
    })
  }
}
