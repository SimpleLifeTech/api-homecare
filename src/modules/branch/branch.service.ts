import { CompanyRepository } from "@modules/company/dao/company.repository";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";

import { BranchRepository } from "./dao/branch.repository";
import { CreateBranchDTO } from "./dto/create-branch.dto";
import { UpdateBranchDTO } from "./dto/update-branch.dto";

const { blank, filled } = new GlobalFunctions();

@Injectable()
export class BranchService {
  constructor(
    @Inject(BranchRepository)
    protected readonly branchRepository: BranchRepository,
    @Inject(CompanyRepository)
    protected readonly companyRepository: CompanyRepository,
  ) {}

  async createBranch(companyId: string, data: CreateBranchDTO) {
    await this.companyExists(companyId);
    const branchExists = await this.branchRepository.findBranchByName(companyId, data.name);

    if (filled(branchExists)) throw new BadRequestException("Já existe uma filial com esse nome");

    await this.branchRepository.createBranch(companyId, data);

    return "Filial criada com sucesso!";
  }

  async findBranchesByCompanyId(companyId: string) {
    await this.companyExists(companyId);
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

    return "Filial atualizada com sucesso!";
  }

  async inactivateBranchById(branchId: string) {
    await this.branchExists(branchId);
    await this.branchRepository.inactivateBranchById(branchId);

    return "Filial inativada com sucesso!";
  }

  private async companyExists(companyId: string) {
    const company = await this.companyRepository.findCompanyById(companyId);

    if (blank(company)) throw new BadRequestException("Empresa não encontrada");

    return company;
  }

  private async branchExists(branchId: string) {
    const branch = await this.branchRepository.findBranchById(branchId);

    if (blank(branch)) throw new BadRequestException("Filial não encontrada");

    return branch;
  }
}
