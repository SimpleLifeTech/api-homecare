import { BranchService } from "@modules/branch/branch.service";
import { CompanyService } from "@modules/company/company.service";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { CacheRepository } from "@shared/shared/cache/cache.repository";
import { GlobalFunctions } from "@shared/shared/utils/functions";

import { CompanyFictionalRepository } from "./dao/company-fictional.repository";
import { CreateCompanyFictionalDTO } from "./dto/create-company-fictional.dto";
import { UpdateCompanyFictionalDTO } from "./dto/update-company-fictional.dto";

const { blank, filled } = new GlobalFunctions();

@Injectable()
export class CompanyFictionalService {
  constructor(
    @Inject(CompanyFictionalRepository)
    private readonly companyFictionalRepository: CompanyFictionalRepository,
    private readonly branchService: BranchService,
    private readonly companyService: CompanyService,
    private readonly cache: CacheRepository,
  ) {}

  async createCompanyFictional(data: CreateCompanyFictionalDTO, companyIdWhoCreates: string) {
    await this.branchService.branchExists(data.branchId);
    await this.companyService.companyExists(companyIdWhoCreates);
    const hasCompanyFictional = await this.companyFictionalRepository.findCompanyFictionalByName(
      data.name,
      data.branchId,
    );

    if (filled(hasCompanyFictional)) throw new BadRequestException("Empresa já cadastrada");

    await this.companyFictionalRepository.createCompanyFictional(data, companyIdWhoCreates);

    return "Empresa criada com sucesso!";
  }

  async findCompanyFictionalById(companyFictionalId: string) {
    return await this.companyFictionalExists(companyFictionalId);
  }

  async findCompanyFictionalByBranchId(branchId: string) {
    await this.branchService.branchExists(branchId);
    return (await this.companyFictionalRepository.findCompanyFictionalByBranchId(branchId)) ?? [];
  }

  async updateCompanyFictional(companyFictionalId: string, data: UpdateCompanyFictionalDTO) {
    await this.companyFictionalExists(companyFictionalId);
    await this.companyFictionalRepository.updateCompanyFictional(companyFictionalId, data);
    await this.cache.del(this.getCacheKey(companyFictionalId));
    return "Empresa atualizada com sucesso!";
  }

  async inactivateCompanyFictional(companyFictionalId: string) {
    await this.companyFictionalExists(companyFictionalId);
    await this.companyFictionalRepository.inactivateCompanyFictional(companyFictionalId);
    await this.cache.del(this.getCacheKey(companyFictionalId));
    return "Empresa deletada com sucesso!";
  }

  async companyFictionalExists(companyFictionalId: string) {
    const cacheKey = this.getCacheKey(companyFictionalId);
    const cachedCompanyFictional = await this.cache.get(cacheKey);

    if (filled(cachedCompanyFictional)) return cachedCompanyFictional;

    const companyFictional =
      await this.companyFictionalRepository.findCompanyFictionalById(companyFictionalId);

    if (blank(companyFictional)) throw new BadRequestException("Empresa não encontrada");

    await this.cache.set(cacheKey, companyFictional);
    return companyFictional;
  }

  private getCacheKey(companyFictionalId: string) {
    return `company-fictional-${companyFictionalId}`;
  }
}
