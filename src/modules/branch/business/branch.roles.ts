import { BranchModel } from "@modules/models/branch";
import { HttpStatus, Injectable } from "@nestjs/common";
import { BusinessErrors } from "@shared/shared/utils/business-errors";

@Injectable()
export class BranchRoles {
  private readonly businessErrors: BusinessErrors;

  constructor() {
    this.businessErrors = new BusinessErrors();
  }

  async branchesNotFound(branches: BranchModel[]) {
    this.businessErrors.addError({
      condition: !branches || branches.length === 0,
      message: "Filiais não encontradas!",
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }

  async branchNotFound(branch: BranchModel) {
    this.businessErrors.addError({
      condition: !branch,
      message: "Filial não encontrada!",
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }

  async branchAlreadyExists(branch: BranchModel) {
    this.businessErrors.addError({
      condition: !!branch,
      message: "Esta filial já existe!",
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}
