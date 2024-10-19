import { CompanyRoles } from "@modules/company/business/company.roles";
import { CompanyRepository } from "@modules/company/dao/company.repository";
import { BranchModel } from "@modules/models/branch.model";
import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { APIResponse, CoreResponse, ErrorTypes } from "@shared/shared/utils/response";

import { BranchRoles } from "./business/branch.roles";
import { BranchRepository } from "./dao/branch.repository";
import { CreateBranchDTO } from "./dto/create-branch.dto";
import { UpdateBranchDTO } from "./dto/update-branch.dto";

@Injectable()
export class BranchService extends BranchRoles {
  constructor(
    @Inject(BranchRepository)
    protected readonly branchRepository: BranchRepository,
    @Inject(CompanyRepository)
    protected readonly companyRepository: CompanyRepository,
    protected readonly companyRoles: CompanyRoles,
    protected readonly response = new CoreResponse(),
  ) {
    super();
  }

  async createBranch(
    companyId: string,
    data: CreateBranchDTO,
  ): Promise<APIResponse<string, ErrorTypes>> {
    const companyExists = await this.companyRepository.findCompanyById(companyId);

    await this.companyRoles.companyNotFound(companyExists);

    const branchExists = await this.branchRepository.findBranchByName(companyId, data.name);

    await this.branchAlreadyExists(branchExists);

    await this.branchRepository.createBranch(companyId, data);

    return this.response.success("Filial criada com sucesso!", HttpStatus.CREATED);
  }

  async findBranchesByCompanyId(
    companyId: string,
  ): Promise<APIResponse<BranchModel[], ErrorTypes>> {
    const companyExists = await this.companyRepository.findCompanyById(companyId);

    await this.companyRoles.companyNotFound(companyExists);

    const branches = await this.branchRepository.findBranchesByCompanyId(companyId);

    await this.branchesNotFound(branches);

    return this.response.success(branches);
  }

  async findBranchById(branchId: string): Promise<APIResponse<BranchModel, ErrorTypes>> {
    const branch = await this.branchRepository.findBranchById(branchId);

    await this.branchNotFound(branch);

    return this.response.success(branch);
  }

  async updateBranchById(
    branchId: string,
    data: UpdateBranchDTO,
  ): Promise<APIResponse<string, ErrorTypes>> {
    const branch = await this.branchRepository.findBranchById(branchId);

    await this.branchNotFound(branch);

    await this.branchRepository.updateBranchById(branchId, data);

    return this.response.success("Filial atualizada com sucesso!");
  }

  async inactivateBranchById(branchId: string): Promise<APIResponse<string, ErrorTypes>> {
    const branch = await this.branchRepository.findBranchById(branchId);

    await this.branchNotFound(branch);

    await this.branchRepository.inactivateBranchById(branchId);

    return this.response.success("Filial inativada com sucesso!");
  }
}
