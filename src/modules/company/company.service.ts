import { PersonRepository } from "@modules/person/dao/person.repository";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";

import { CompanyRepository } from "./dao/company.repository";
import { CreateCompanyDTO } from "./dto/create-company.dto";
import { UpdateCompanyDTO } from "./dto/update-company.dto";

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
  ) {
    await this.personExists(personId);
    const isCompanyAlreadyExists = await this.companyRepository.findCompanyByDocument(
      createCompanyDTO.document,
    );

    if (filled(isCompanyAlreadyExists)) throw new BadRequestException("Empresa já cadastrada");

    await this.companyRepository.createCompanyAndBranch(personId, createCompanyDTO, file);

    return "Empresa criada com sucesso!";
  }

  async findCompanyById(companyId: string) {
    return this.companyExists(companyId);
  }

  async findCompanyByUserId(personId: string) {
    await this.personExists(personId);
    const company = await this.companyRepository.findCompanyByUserId(personId);

    if (blank(company)) throw new BadRequestException("Empresa não encontrada");

    return company;
  }

  async updateCompany(companyId: string, company: UpdateCompanyDTO, file?: Express.Multer.File) {
    await this.companyExists(companyId);
    await this.companyRepository.updateCompanyById(companyId, company, file);

    return "Empresa atualizada com sucesso!";
  }

  async inactivateCompany(companyId: string) {
    await this.companyExists(companyId);
    await this.companyRepository.inactivateCompanyById(companyId);

    return "Empresa deletada com sucesso!";
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
