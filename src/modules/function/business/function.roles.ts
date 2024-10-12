import { FunctionModel } from "@modules/models/function.model";
import { HttpStatus, Injectable } from "@nestjs/common";
import { BusinessErrors } from "@shared/shared/utils/business-errors";

@Injectable()
export class FunctionRoles {
  private readonly businessErrors: BusinessErrors;

  constructor() {
    this.businessErrors = new BusinessErrors();
  }

  async functionsNotFound(functions: FunctionModel[]) {
    this.businessErrors.addError({
      condition: !functions || functions.length === 0,
      message: "Funções não encontradas!",
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }

  async functionNotFound(_function: FunctionModel) {
    this.businessErrors.addError({
      condition: !_function,
      message: "Função não encontrada!",
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }

  async functionAlreadyExists(_function: FunctionModel) {
    this.businessErrors.addError({
      condition: !!_function,
      message: "Esta função já existe!",
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}
