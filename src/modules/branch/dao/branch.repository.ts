import { BranchModel } from "@modules/models/branch.model";
import { DataSource, UpdateResult } from "typeorm";

import { CreateBranchDTO } from "../dto/create-branch.dto";
import { UpdateBranchDTO } from "../dto/update-branch.dto";

export class BranchRepository {
  constructor(private dataSource: DataSource) {}
  private readonly repository = this.dataSource.getRepository(BranchModel);

  async createBranch(data: CreateBranchDTO): Promise<BranchModel> {
    return this.repository.save(data);
  }

  async findBranchByHomecareId(homecareId: string): Promise<BranchModel[]> {
    return this.repository.findBy({ homecare_id: homecareId });
  }

  async findBranchByCompanyId(companyId: string): Promise<BranchModel[]> {
    return this.repository.findBy({ company_id: companyId });
  }

  async findBranchById(branchId: string): Promise<BranchModel> {
    return this.repository.findOne({ where: { id: branchId } });
  }

  async updateBranchById(branchId: string, data: UpdateBranchDTO): Promise<UpdateResult> {
    return this.repository.update({ id: branchId }, data);
  }

  async inactivateBranchById(branchId: string): Promise<UpdateResult> {
    return this.repository.softDelete({ id: branchId });
  }
}
