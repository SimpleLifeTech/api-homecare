import { PersonPermissionModel } from "@modules/models/person-permission.model";
import { HttpStatus, Injectable } from "@nestjs/common";
import { BusinessErrors } from "@shared/shared/utils/business-errors";

@Injectable()
export class PersonPermissionRoles {
  private readonly businessErrors: BusinessErrors;

  constructor() {
    this.businessErrors = new BusinessErrors();
  }

  async personPermissionsNotFound(permissions: PersonPermissionModel[]) {
    this.businessErrors.addError({
      condition: !permissions || permissions.length === 0,
      message: "Esta pessoa não possui permissões!",
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }

  async personPermissionNotFound(permission: PersonPermissionModel) {
    this.businessErrors.addError({
      condition: !permission,
      message: "Esta pessoa não possui permissão!",
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }

  async personPermissionAlreadyGiven(permission: PersonPermissionModel) {
    this.businessErrors.addError({
      condition: !!permission,
      message: "Esta pessoa já possui esta permissão!",
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}
