import { FunctionPermissionModel } from "@modules/models/function-permission.model";
import { HttpStatus, Injectable } from "@nestjs/common";
import { BusinessErrors } from "@shared/shared/utils/business-errors";

@Injectable()
export class FunctionPermissionRoles {
  private readonly businessErrors: BusinessErrors;

  constructor() {
    this.businessErrors = new BusinessErrors();
  }

  async functionPermissionNotFound(functionPermission: FunctionPermissionModel) {
    this.businessErrors.addError({
      condition: !functionPermission,
      message: "Permissão não encontrada!",
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }

  async functionPermissionAlreadyExists(functionPermission: FunctionPermissionModel) {
    this.businessErrors.addError({
      condition: !!functionPermission,
      message: "Esta permissão já existe!",
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}
