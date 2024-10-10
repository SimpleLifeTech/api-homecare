import { CompanyModel } from "@modules/models/company.model";
import { HttpStatus } from "@nestjs/common";
import { APIResponse, CoreResponse, ErrorTypes } from "@shared/shared/utils/response";

import { CompanyRoles } from "./business/company.roles";
import { CompanyRepository } from "./dao/company.repository";
import { CreateCompanyDTO } from "./dto/create-company.dto";
import { UpdateCompanyDTO } from "./dto/update-company.dto";
import { BrazilAPI } from "@shared/shared/externals/brazil-api/external.apis";

export class CompanyService extends CompanyRoles {
  constructor(
    protected readonly companyRepository: CompanyRepository,
    protected readonly response = new CoreResponse(),
  ) {
    super();
  }

  private readonly brazilAPI = new BrazilAPI();

  async createCompany(
    createCompanyDTO: CreateCompanyDTO,
  ): Promise<APIResponse<string, ErrorTypes>> {
    const isCompanyAlreadyExists = await this.companyRepository.findCompanyByDocument(
      createCompanyDTO.document,
    );

    await this.companyAlreadyExists(isCompanyAlreadyExists);

    const cnpj = await this.brazilAPI.getCNPJ(createCompanyDTO.document);

    await this.documentDoesntExist(cnpj.data);

    if (cnpj.data.descricao_situacao_cadastral !== "ATIVA")
      return this.response.error("CNPJ não está ativo!");

    await this.companyRepository.createCompany(createCompanyDTO);

    return this.response.success("Empresa criada com sucesso!", HttpStatus.CREATED);
  }

  async findCompanyById(companyId: string): Promise<APIResponse<CompanyModel, ErrorTypes>> {
    const company = await this.companyRepository.findCompanyById(companyId);

    await this.companyNotFound(company);

    return this.response.success(company);
  }

  async updateCompany(
    companyId: string,
    company: UpdateCompanyDTO,
  ): Promise<APIResponse<string, ErrorTypes>> {
    const companyExists = await this.companyRepository.findCompanyById(companyId);

    await this.companyNotFound(companyExists);

    await this.companyRepository.updateCompanyById(companyId, company);

    return this.response.success("Empresa atualizada com sucesso!");
  }

  async inactivateCompany(companyId: string): Promise<APIResponse<string, ErrorTypes>> {
    const companyExists = await this.companyRepository.findCompanyById(companyId);

    await this.companyNotFound(companyExists);

    await this.companyRepository.inactivateCompanyById(companyId);

    return this.response.success("Empresa deletada com sucesso!");
  }
}
