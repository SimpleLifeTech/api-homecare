import { HttpStatus, Injectable } from "@nestjs/common";
import { BusinessErrors } from "@shared/shared/utils/business-errors";

@Injectable()
export class AuthRoles {
  private readonly businessErrors: BusinessErrors;

  constructor() {
    this.businessErrors = new BusinessErrors();
  }

  public async userNotFind(user_id: string) {
    this.businessErrors.addError({
      condition: !user_id,
      message: "Usuário não encontrado",
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }

  public async userDeleted(deletedAt: Date) {
    this.businessErrors.addError({
      condition: !!deletedAt,
      message: "Usuário inativado",
      messageCode: "UserNotFound",
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }

  public async loginError(passwordMatches: boolean) {
    this.businessErrors.addError({
      condition: !passwordMatches,
      message: "Email ou senha incorretos",
      messageCode: "InvalidCredentials",
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }

  public async accessDenied(hashedRt: string) {
    this.businessErrors.addError({
      condition: !hashedRt,
      message: "Acesso Negado",
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }

  public async accessDeniedTwo(rtMatches: boolean) {
    this.businessErrors.addError({
      condition: !rtMatches,
      message: "Acesso Negado",
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }

  public async tokenError(token: string) {
    this.businessErrors.addError({
      condition: !token,
      message: "Acesso Negado",
      statusCode: HttpStatus.FORBIDDEN,
    });
  }
}
