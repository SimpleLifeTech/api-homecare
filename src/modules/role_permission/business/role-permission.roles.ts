import { RolePermissionModel } from "@modules/models/role-permission.model";
import { HttpStatus, Injectable } from "@nestjs/common";
import { BusinessErrors } from "@shared/shared/utils/business-errors";

@Injectable()
export class RolePermissionRoles {
  private readonly businessErrors: BusinessErrors;

  constructor() {
    this.businessErrors = new BusinessErrors();
  }

  async rolePermissionNotFound(rolePermission: RolePermissionModel) {
    this.businessErrors.addError({
      condition: !rolePermission,
      message: "Permissão não encontrada!",
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }

  async rolePermissionAlreadyExists(rolePermission: RolePermissionModel) {
    this.businessErrors.addError({
      condition: !!rolePermission,
      message: "Esta permissão já existe!",
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}
