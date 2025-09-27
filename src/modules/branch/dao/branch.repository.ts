import { Injectable } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { PrismaService } from "src/database/prisma/prisma.service";

import { CreateBranchDTO } from "../dto/create-branch.dto";
import { UpdateBranchDTO } from "../dto/update-branch.dto";

const { getCurrentDateAndTime, removeSpecialCharacters } = new GlobalFunctions();

@Injectable()
export class BranchRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createBranch(companyId: string, data: CreateBranchDTO) {
    return this.prisma.branch.create({
      data: { companyId: companyId, ...data, document: removeSpecialCharacters(data.document) },
    });
  }

  async findBranchesByCompanyId(companyId: string) {
    return this.prisma.branch.findMany({ where: { companyId: companyId, deletedAt: null } });
  }

  async findBranchById(branchId: string) {
    return this.prisma.branch.findUnique({ where: { id: branchId, deletedAt: null } });
  }

  async findBranchByName(companyId: string, name: string) {
    return this.prisma.branch.findFirst({
      where: { companyId: companyId, name, deletedAt: null },
    });
  }

  async updateBranchById(branchId: string, data: UpdateBranchDTO) {
    return this.prisma.branch.update({
      where: { id: branchId },
      data: { ...data, document: removeSpecialCharacters(data.document) },
    });
  }

  async inactivateBranchById(branchId: string) {
    return this.prisma.branch.update({
      where: { id: branchId },
      data: { deletedAt: getCurrentDateAndTime() },
    });
  }
}
