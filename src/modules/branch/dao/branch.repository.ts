import { BranchModel } from "@modules/models/branch.model";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { PrismaService } from "src/database/prisma/prisma.service";

import { CreateBranchDTO } from "../dto/create-branch.dto";
import { UpdateBranchDTO } from "../dto/update-branch.dto";
import { Injectable } from "@nestjs/common";

const globalFunction = new GlobalFunctions();

@Injectable()
export class BranchRepository {
  constructor(private prisma: PrismaService) {}

  async createBranch(companyId: string, data: CreateBranchDTO): Promise<BranchModel> {
    return this.prisma.branch.create({ data: { company_id: companyId, ...data } });
  }

  async findBranchesByCompanyId(companyId: string): Promise<BranchModel[]> {
    return this.prisma.branch.findMany({ where: { company_id: companyId, deleted_at: null } });
  }

  async findBranchById(branchId: string): Promise<BranchModel> {
    return this.prisma.branch.findUnique({ where: { id: branchId, deleted_at: null } });
  }

  async findBranchByName(companyId: string, name: string): Promise<BranchModel> {
    return this.prisma.branch.findFirst({
      where: { company_id: companyId, name, deleted_at: null },
    });
  }

  async updateBranchById(branchId: string, data: UpdateBranchDTO): Promise<BranchModel> {
    return this.prisma.branch.update({ where: { id: branchId }, data: { ...data } });
  }

  async inactivateBranchById(branchId: string): Promise<BranchModel> {
    return this.prisma.branch.update({
      where: { id: branchId },
      data: { deleted_at: globalFunction.getCurrentDateAndTime() },
    });
  }
}
