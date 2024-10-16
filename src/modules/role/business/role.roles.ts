import { RoleModel } from "@modules/models/role.model";
import { HttpStatus, Injectable } from "@nestjs/common";
import { BusinessErrors } from "@shared/shared/utils/business-errors";

@Injectable()
export class RoleRoles {
  private readonly businessErrors: BusinessErrors;

  constructor() {
    this.businessErrors = new BusinessErrors();
  }

  async rolesNotFound(roles: RoleModel[]) {
    this.businessErrors.addError({
      condition: !roles || roles.length === 0,
      message: "Funções não encontradas!",
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }

  async roleNotFound(role: RoleModel) {
    this.businessErrors.addError({
      condition: !role,
      message: "Função não encontrada!",
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }

  async roleAlreadyExists(role: RoleModel) {
    this.businessErrors.addError({
      condition: !!role,
      message: "Esta função já existe!",
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}
