import { CompanyModel } from "@modules/models/company.model";
import { PersonRoles } from "@modules/person/business/person.roles";
import { PersonRepository } from "@modules/person/dao/person.repository";
import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { BrazilAPI } from "@shared/shared/externals/brazil-api/brazil.apis";
import { APIResponse, CoreResponse, ErrorTypes } from "@shared/shared/utils/response";

import { CompanyRoles } from "./business/company.roles";
import { CompanyRepository } from "./dao/company.repository";
import { CreateCompanyDTO } from "./dto/create-company.dto";
import { UpdateCompanyDTO } from "./dto/update-company.dto";

const response = new CoreResponse();

@Injectable()
export class CompanyService extends CompanyRoles {
  constructor(
    @Inject(CompanyRepository)
    protected readonly companyRepository: CompanyRepository,
    @Inject(PersonRepository)
    protected readonly personRepository: PersonRepository,
    protected readonly personRoles: PersonRoles,
    private readonly brazilAPI: BrazilAPI,
  ) {
    super();
  }
  async createCompany(
    personId: string,
    createCompanyDTO: CreateCompanyDTO,
    file: Express.Multer.File,
  ): Promise<APIResponse<string, ErrorTypes>> {
    const personExists = await this.personRepository.findPersonById(personId);

    await this.personRoles.personNotFound(personExists);

    const isCompanyAlreadyExists = await this.companyRepository.findCompanyByDocument(
      createCompanyDTO.document,
    );

    await this.companyAlreadyExists(isCompanyAlreadyExists);

    // precisa lidar com erro de cnpj dessa requisição
    const cnpj = await this.brazilAPI.getCNPJ(createCompanyDTO.document);

    await this.documentDoesntExist(cnpj.data);

    await this.documentsIsNotActive(cnpj.data.descricao_situacao_cadastral);

    await this.companyRepository.createCompanyAndBranch(personId, createCompanyDTO, file);

    return response.success("Empresa criada com sucesso!", HttpStatus.CREATED);
  }

  async findCompanyById(companyId: string): Promise<APIResponse<CompanyModel, ErrorTypes>> {
    const company = await this.companyRepository.findCompanyById(companyId);

    await this.companyNotFound(company);

    return response.success(company);
  }

  async findCompanyByUserId(personId: string): Promise<APIResponse<CompanyModel, ErrorTypes>> {
    const personExists = await this.personRepository.findPersonById(personId);

    await this.personRoles.personNotFound(personExists);

    const company = await this.companyRepository.findCompanyByUserId(personId);

    await this.companyNotFound(company);

    return response.success(company);
  }

  async updateCompany(
    companyId: string,
    company: UpdateCompanyDTO,
    file: Express.Multer.File,
  ): Promise<APIResponse<string, ErrorTypes>> {
    const companyExists = await this.companyRepository.findCompanyById(companyId);

    await this.companyNotFound(companyExists);

    await this.companyRepository.updateCompanyById(companyId, company, file);

    return response.success("Empresa atualizada com sucesso!");
  }

  async inactivateCompany(companyId: string): Promise<APIResponse<string, ErrorTypes>> {
    const companyExists = await this.companyRepository.findCompanyById(companyId);

    await this.companyNotFound(companyExists);

    await this.companyRepository.inactivateCompanyById(companyId);

    return response.success("Empresa deletada com sucesso!");
  }
}
