import { CompanyRepository } from "@modules/company/dao/company.repository";
import { BranchModel } from "@modules/models/branch.model";
import { BadRequestException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { APIResponse, CoreResponse, ErrorTypes } from "@shared/shared/utils/response";

import { BranchRepository } from "./dao/branch.repository";
import { CreateBranchDTO } from "./dto/create-branch.dto";
import { UpdateBranchDTO } from "./dto/update-branch.dto";

const response = new CoreResponse();
const globalFunctions = new GlobalFunctions();

@Injectable()
export class BranchService {
  constructor(
    @Inject(BranchRepository)
    protected readonly branchRepository: BranchRepository,
    @Inject(CompanyRepository)
    protected readonly companyRepository: CompanyRepository,
  ) {}

  async createBranch(
    companyId: string,
    data: CreateBranchDTO,
  ): Promise<APIResponse<string, ErrorTypes>> {
    await this.companyExists(companyId);
    const branchExists = await this.branchRepository.findBranchByName(companyId, data.name);

    if (globalFunctions.filled(branchExists))
      throw new BadRequestException("Já existe uma filial com esse nome");

    await this.branchRepository.createBranch(companyId, data);

    return response.success("Filial criada com sucesso!", HttpStatus.CREATED);
  }

  async findBranchesByCompanyId(
    companyId: string,
  ): Promise<APIResponse<BranchModel[], ErrorTypes>> {
    await this.companyExists(companyId);
    const branches = await this.branchRepository.findBranchesByCompanyId(companyId);

    if (globalFunctions.blank(branches))
      throw new BadRequestException("Nenhuma filial encontrada para essa empresa");

    return response.success(branches);
  }

  async findBranchById(branchId: string): Promise<APIResponse<BranchModel, ErrorTypes>> {
    const branch = await this.branchExists(branchId);
    return response.success(branch);
  }

  async updateBranchById(
    branchId: string,
    data: UpdateBranchDTO,
  ): Promise<APIResponse<string, ErrorTypes>> {
    await this.branchExists(branchId);
    await this.branchRepository.updateBranchById(branchId, data);

    return response.success("Filial atualizada com sucesso!");
  }

  async inactivateBranchById(branchId: string): Promise<APIResponse<string, ErrorTypes>> {
    await this.branchExists(branchId);
    await this.branchRepository.inactivateBranchById(branchId);

    return response.success("Filial inativada com sucesso!");
  }

  private async companyExists(companyId: string) {
    const company = await this.companyRepository.findCompanyById(companyId);

    if (globalFunctions.blank(company)) throw new BadRequestException("Empresa não encontrada");

    return company;
  }

  private async branchExists(branchId: string) {
    const branch = await this.branchRepository.findBranchById(branchId);

    if (globalFunctions.blank(branch)) throw new BadRequestException("Filial não encontrada");

    return branch;
  }
}
