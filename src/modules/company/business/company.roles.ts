import { CompanyModel } from "@modules/models/company.model";
import { HttpStatus, Injectable } from "@nestjs/common";
import { CNPJ_RESPONSE } from "@shared/shared/externals/brazil-api/external.types";
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

  async documentDoesntExist(document: CNPJ_RESPONSE) {
    this.businessErrors.addError({
      condition: !document,
      message: "CNPJ inválido!",
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }

  async documentsIsNotActive(situation: string) {
    this.businessErrors.addError({
      condition: situation !== "ATIVA",
      message: "CNPJ não está ativo",
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}
