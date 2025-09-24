import { CompanyService } from '@modules/company/company.service';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GlobalFunctions } from '@shared/shared/utils/functions';

import { BranchRepository } from './dao/branch.repository';
import { CreateBranchDTO } from './dto/create-branch.dto';
import { UpdateBranchDTO } from './dto/update-branch.dto';
import { CacheRepository } from '@shared/shared/cache/cache.repository';
import { Branch } from '@prisma/client';

const { blank, filled } = new GlobalFunctions();

@Injectable()
export class BranchService {
  constructor(
    @Inject(BranchRepository)
    protected readonly branchRepository: BranchRepository,
    protected readonly companyService: CompanyService,
    protected readonly cache: CacheRepository
  ) {}

  async createBranch(companyId: string, data: CreateBranchDTO) {
    await this.companyService.companyExists(companyId);
    const branchExists = await this.branchRepository.findBranchByName(companyId, data.name);

    if (filled(branchExists)) throw new BadRequestException("Já existe uma filial com esse nome");

    await this.branchRepository.createBranch(companyId, data);

    return "Filial criada com sucesso!";
  }

  async findBranchesByCompanyId(companyId: string) {
    await this.companyService.companyExists(companyId);
    const branches = await this.branchRepository.findBranchesByCompanyId(companyId);

    if (blank(branches))
      throw new BadRequestException("Nenhuma filial encontrada para essa empresa");

    return branches;
  }

  async findBranchById(branchId: string) {
    return await this.branchExists(branchId);
  }

  async updateBranchById(branchId: string, data: UpdateBranchDTO) {
    await this.branchExists(branchId);
    await this.branchRepository.updateBranchById(branchId, data);
    await this.cache.del(this.cacheKey(branchId));
    return "Filial atualizada com sucesso!";
  }

  async inactivateBranchById(branchId: string) {
    await this.branchExists(branchId);
    await this.branchRepository.inactivateBranchById(branchId);
    await this.cache.del(this.cacheKey(branchId));
    return "Filial inativada com sucesso!";
  }

  async branchExists(branchId: string): Promise<Branch> {
    const cachekey = this.cacheKey(branchId);
    const cache = await this.cache.get(cachekey);

    if (filled(cache)) return cache as Branch;

    const branch = await this.branchRepository.findBranchById(branchId);

    if (blank(branch)) throw new BadRequestException("Filial não encontrada");

    await this.cache.set(cachekey, branch);
    return branch;
  }

  private cacheKey(branchId: string) {
    return `branch:${branchId}`
  } 
}
