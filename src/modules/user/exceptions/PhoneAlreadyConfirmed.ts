import { AppHttpException } from "@shared/shared/exceptions/AppHttpException"

export class PhoneAlreadyConfirmed extends AppHttpException {
  constructor() {
    super({
      message: "Número já confirmado",
      code: PhoneAlreadyConfirmed.name,
    })
  }
}
