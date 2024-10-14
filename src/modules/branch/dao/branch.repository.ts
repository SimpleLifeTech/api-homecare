import { BranchModel } from "@modules/models/branch.model";
import { DataSource, UpdateResult } from "typeorm";

import { CreateBranchDTO } from "../dto/create-branch.dto";
import { UpdateBranchDTO } from "../dto/update-branch.dto";

export class BranchRepository {
  constructor(private dataSource: DataSource) {}
  private readonly repository = this.dataSource.getRepository(BranchModel);

  async createBranch(companyId: string, data: CreateBranchDTO): Promise<BranchModel> {
    return this.repository.save({ company_id: companyId, ...data });
  }

  async findBranchByCompanyId(companyId: string): Promise<BranchModel[]> {
    return this.repository.findBy({ company_id: companyId });
  }

  async findBranchById(branchId: string): Promise<BranchModel> {
    return this.repository.findOneBy({ id: branchId });
  }

  async findBranchByName(companyId: string, name: string): Promise<BranchModel> {
    return this.repository.findOneBy({ company_id: companyId, name });
  }

  async updateBranchById(branchId: string, data: UpdateBranchDTO): Promise<UpdateResult> {
    return this.repository.update({ id: branchId }, data);
  }

  async inactivateBranchById(branchId: string): Promise<UpdateResult> {
    return this.repository.softDelete({ id: branchId });
  }
}
