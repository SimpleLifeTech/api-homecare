import { CompanyModel } from "@modules/models/company.model";
import { PersonRepository } from "@modules/person/dao/person.repository";
import { BadRequestException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { APIResponse, CoreResponse, ErrorTypes } from "@shared/shared/utils/response";

import { CompanyRepository } from "./dao/company.repository";
import { CreateCompanyDTO } from "./dto/create-company.dto";
import { UpdateCompanyDTO } from "./dto/update-company.dto";

const response = new CoreResponse();
const { filled, blank } = new GlobalFunctions();

@Injectable()
export class CompanyService {
  constructor(
    @Inject(CompanyRepository)
    protected readonly companyRepository: CompanyRepository,
    @Inject(PersonRepository)
    protected readonly personRepository: PersonRepository,
  ) {}
  async createCompany(
    personId: string,
    createCompanyDTO: CreateCompanyDTO,
    file?: Express.Multer.File,
  ): Promise<APIResponse<string, ErrorTypes>> {
    await this.personExists(personId);
    const isCompanyAlreadyExists = await this.companyRepository.findCompanyByDocument(
      createCompanyDTO.document,
    );

    if (filled(isCompanyAlreadyExists)) throw new BadRequestException("Empresa já cadastrada");

    await this.companyRepository.createCompanyAndBranch(personId, createCompanyDTO, file);

    return response.success("Empresa criada com sucesso!", HttpStatus.CREATED);
  }

  async findCompanyById(companyId: string): Promise<APIResponse<CompanyModel, ErrorTypes>> {
    const company = await this.companyExists(companyId);
    return response.success(company);
  }

  async findCompanyByUserId(personId: string): Promise<APIResponse<CompanyModel, ErrorTypes>> {
    await this.personExists(personId);
    const company = await this.companyRepository.findCompanyByUserId(personId);

    if (blank(company)) throw new BadRequestException("Empresa não encontrada");

    return response.success(company);
  }

  async updateCompany(
    companyId: string,
    company: UpdateCompanyDTO,
    file?: Express.Multer.File,
  ): Promise<APIResponse<string, ErrorTypes>> {
    await this.companyExists(companyId);
    await this.companyRepository.updateCompanyById(companyId, company, file);

    return response.success("Empresa atualizada com sucesso!");
  }

  async inactivateCompany(companyId: string): Promise<APIResponse<string, ErrorTypes>> {
    await this.companyExists(companyId);
    await this.companyRepository.inactivateCompanyById(companyId);

    return response.success("Empresa deletada com sucesso!");
  }

  private async companyExists(companyId: string) {
    const company = await this.companyRepository.findCompanyById(companyId);

    if (blank(company)) throw new BadRequestException("Empresa não encontrada");

    return company;
  }

  private async personExists(personId: string) {
    const person = await this.personRepository.findPersonById(personId);

    if (blank(person)) throw new BadRequestException("Pessoa não encontrada");

    return person;
  }
}
