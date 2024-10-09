import { CompanyModel } from "@modules/models/company.model";
import { HttpStatus, Injectable } from "@nestjs/common";
import { BusinessErrors } from "@shared/shared/utils/business-errors";

@Injectable()
export class CompanyRoles {
  private readonly businessErrors: BusinessErrors;

  constructor() {
    this.businessErrors = new BusinessErrors();
  }

  async companyNotFound(company: CompanyModel) {
    this.businessErrors.addError({
      condition: !company,
      message: "Empresa não encontrada!",
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }

  async companyAlreadyExists(company: CompanyModel) {
    this.businessErrors.addError({
      condition: !!company,
      message: "Esta empresa já existe!",
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}
