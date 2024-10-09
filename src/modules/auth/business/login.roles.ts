import { HttpStatus, Injectable } from "@nestjs/common"
import { BusinessErrors } from "src/modules/shared/utils/business-errors"

@Injectable()
export class LoginRoles {
  protected businessErrors: BusinessErrors

  constructor() {
    this.businessErrors = new BusinessErrors()
  }

  public throwErrors() {
    return this.businessErrors.throwErrors()
  }

  public clearErrors() {
    return this.businessErrors.clearErrors()
  }

  public async userNotFind(user_id: string) {
    this.businessErrors.addError({
      condition: !user_id,
      message: "Usuário não encontrado",
      statusCode: HttpStatus.BAD_REQUEST,
    })
  }

  public async phoneNotConfirmed(confirmed_at: Date) {
    this.businessErrors.addError({
      condition: !confirmed_at,
      message: "Telefone aguardando confirmação",
      statusCode: HttpStatus.BAD_REQUEST,
      messageCode: "PHONE_UNVERIFIED",
    })
  }

  public async userNotConfirmed(confirmed_at: Date) {
    this.businessErrors.addError({
      condition: !confirmed_at,
      message: "Conta aguardando confirmação de e-mail",
      statusCode: HttpStatus.BAD_REQUEST,
      messageCode: "EMAIL_UNVERIFIED",
    })
  }

  public async userDeleted(deleted_at: Date) {
    this.businessErrors.addError({
      condition: !!deleted_at,
      message: "Usuário deletado",
      messageCode: "UserNotFound",
      statusCode: HttpStatus.BAD_REQUEST,
    })
  }

  public async loginError(passwordMatches: boolean) {
    this.businessErrors.addError({
      condition: !passwordMatches,
      message: "Email ou senha incorretos",
      messageCode: "InvalidCredentials",
      statusCode: HttpStatus.BAD_REQUEST,
    })
  }

  public async acessDenied(hashedRt: string) {
    this.businessErrors.addError({
      condition: !hashedRt,
      message: "Access Denied",
      statusCode: HttpStatus.BAD_REQUEST,
    })
  }

  public async acessDeniedTwo(rtMatches: boolean) {
    this.businessErrors.addError({
      condition: !rtMatches,
      message: "Access Denied",
      statusCode: HttpStatus.BAD_REQUEST,
    })
  }

  public async tokenError(token: string) {
    this.businessErrors.addError({
      condition: !token,
      message: "Access Denied",
      statusCode: HttpStatus.FORBIDDEN,
    })
  }
}
