import { PersonService } from '@modules/person/person.service';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CacheRepository } from '@shared/shared/cache/cache.repository';
import { GlobalFunctions } from '@shared/shared/utils/functions';

import { CompanyRepository } from './dao/company.repository';
import { CreateCompanyDTO } from './dto/create-company.dto';
import { UpdateCompanyDTO } from './dto/update-company.dto';

const { filled, blank } = new GlobalFunctions();

@Injectable()
export class CompanyService {
  constructor(
    @Inject(CompanyRepository)
    protected readonly companyRepository: CompanyRepository,
    protected readonly personService: PersonService,
    private readonly cache: CacheRepository,
  ) {}

  async createCompany(
    personId: string,
    createCompanyDTO: CreateCompanyDTO,
    file?: Express.Multer.File,
  ) {
    await this.personService.findPersonById(personId);
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
    await this.personService.findPersonById(personId);
    const company = await this.companyRepository.findCompanyByUserId(personId);

    if (blank(company)) throw new BadRequestException("Empresa não encontrada");

    return company;
  }

  async updateCompany(companyId: string, company: UpdateCompanyDTO, file?: Express.Multer.File) {
    await this.companyExists(companyId);
    await this.companyRepository.updateCompanyById(companyId, company, file);
    await this.cache.del(this.cacheKey(companyId));
    return "Empresa atualizada com sucesso!";
  }

  async inactivateCompany(companyId: string) {
    await this.companyExists(companyId);
    await this.companyRepository.inactivateCompanyById(companyId);
    await this.cache.del(this.cacheKey(companyId));
    return "Empresa deletada com sucesso!";
  }

  async companyExists(companyId: string) {
    const cachekey = this.cacheKey(companyId);
    const cache = await this.cache.get(cachekey);

    if (filled(cache)) return cache;

    const company = await this.companyRepository.findCompanyById(companyId);

    if (blank(company)) throw new BadRequestException("Empresa não encontrada");

    await this.cache.set(cachekey, company);
    return company;
  }

  private cacheKey(companyId: string) {
    return `company:${companyId}`;
  }
}
