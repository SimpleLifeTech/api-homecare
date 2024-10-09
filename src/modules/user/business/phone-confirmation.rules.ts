import { BusinessErrors } from "@shared/shared/utils/business-errors"
import { HttpStatus } from "@nestjs/common"
import { ProfileEntity } from "../../profile/entities/profile.entity"

export class PhoneConfirmationRules {
  protected errors: BusinessErrors

  constructor() {
    this.errors = new BusinessErrors()
  }

  userProfileExists(profile: ProfileEntity) {
    this.errors.addError({
      condition: !profile,
      statusCode: HttpStatus.BAD_REQUEST,
      message: "Usuário inválido",
    })
  }

  phoneNotValidated(profile: ProfileEntity) {
    this.errors.addError({
      condition: !!profile.phone_confirmed_at,
      statusCode: HttpStatus.BAD_REQUEST,
      message: "Telefone já validado",
    })
  }

  validUserPhone(phone: ProfileEntity["phone"]) {
    this.errors.addError({
      condition: !phone,
      statusCode: HttpStatus.BAD_REQUEST,
      message: "Usuário não possui telefone cadastrado",
    })
  }

  requestsRateLimit(hasPendinTransaction: boolean) {
    this.errors.addError({
      condition: hasPendinTransaction,
      statusCode: HttpStatus.TOO_MANY_REQUESTS,
      message: "Houve uma solicitação há pouco. Aguarde alguns segundos e tente novamente.",
    })
  }

  codeExists(exists: boolean) {
    this.errors.addError({
      condition: !exists,
      statusCode: HttpStatus.BAD_REQUEST,
      message: "Código inválido",
    })
  }
}
