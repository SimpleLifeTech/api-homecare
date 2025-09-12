import { BranchModel } from "@modules/models/branch.model";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { PrismaService } from "src/database/prisma/prisma.service";

import { CreateBranchDTO } from "../dto/create-branch.dto";
import { UpdateBranchDTO } from "../dto/update-branch.dto";
import { Injectable } from "@nestjs/common";

const { getCurrentDateAndTime } = new GlobalFunctions();

@Injectable()
export class BranchRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createBranch(companyId: string, data: CreateBranchDTO): Promise<BranchModel> {
    return this.prisma.branch.create({ data: { companyId: companyId, ...data } });
  }

  async findBranchesByCompanyId(companyId: string): Promise<BranchModel[]> {
    return this.prisma.branch.findMany({ where: { companyId: companyId, deletedAt: null } });
  }

  async findBranchById(branchId: string): Promise<BranchModel> {
    return this.prisma.branch.findUnique({ where: { id: branchId, deletedAt: null } });
  }

  async findBranchByName(companyId: string, name: string): Promise<BranchModel> {
    return this.prisma.branch.findFirst({
      where: { companyId: companyId, name, deletedAt: null },
    });
  }

  async updateBranchById(branchId: string, data: UpdateBranchDTO): Promise<BranchModel> {
    return this.prisma.branch.update({ where: { id: branchId }, data: { ...data } });
  }

  async inactivateBranchById(branchId: string): Promise<BranchModel> {
    return this.prisma.branch.update({
      where: { id: branchId },
      data: { deletedAt: getCurrentDateAndTime() },
    });
  }
}
