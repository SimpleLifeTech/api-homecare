import { HttpStatus, Injectable } from "@nestjs/common"
import { BusinessErrors } from "src/modules/shared/utils/business-errors"
import { UserEntity } from "../entities/user.entity"

@Injectable()
export class UserRoles {
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

  protected async emailAlreadyExists(user: UserEntity) {
    this.businessErrors.addError({
      condition: !!user,
      message:
        "Email já cadastrado. Caso tenha esquecido a senha, utilize a opção de recuperação de senha em nossa página de login para redefinir sua senha.",
      statusCode: HttpStatus.BAD_REQUEST,
    })
  }

  protected async passwordDoesNotMatch(passwordMatch: boolean) {
    this.businessErrors.addError({
      condition: !passwordMatch,
      message: "Senha antiga não confere",
      statusCode: HttpStatus.BAD_REQUEST,
    })
  }

  protected async userNotFound(user: UserEntity) {
    this.businessErrors.addError({
      condition: !user,
      message: "Usuário não encontrado",
      statusCode: HttpStatus.NOT_FOUND,
    })
  }

  protected async userAreadyConfirmed(confirmed_at: Date) {
    this.businessErrors.addError({
      condition: !!confirmed_at,
      message: "Esta conta de usuário já foi confirmada",
      statusCode: HttpStatus.BAD_REQUEST,
    })
  }

  protected async userTokenNotFound(user: UserEntity) {
    this.businessErrors.addError({
      condition: !user,
      message: "Token inválido ou expirado",
      statusCode: HttpStatus.BAD_REQUEST,
    })
  }

  protected async userTokenNotEqual(condition: boolean) {
    this.businessErrors.addError({
      condition: condition,
      message: "Token inválido ou expirado",
      statusCode: HttpStatus.BAD_REQUEST,
    })
  }

  protected async tokenNotFound(token: boolean) {
    this.businessErrors.addError({
      condition: !!token,
      message: "Token expirado ou inválido",
      statusCode: HttpStatus.NOT_FOUND,
    })
  }

  protected async userHasBeenDeleted(deleted_at: Date) {
    this.businessErrors.addError({
      condition: !!deleted_at,
      message: "Dados inválidos",
      statusCode: HttpStatus.BAD_REQUEST,
    })
  }
}
