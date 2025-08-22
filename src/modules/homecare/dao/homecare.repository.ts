import { HomecareModel } from "@modules/models/homecare.model";
import { Injectable } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { PrismaService } from "src/database/prisma/prisma.service";

import { CreateHomecareDTO } from "../dto/create-homecare.dto";
import { UpdateHomecareDTO } from "../dto/update-homecare.dto";

const globalFunction = new GlobalFunctions();

@Injectable()
export class HomecareRepository {
  constructor(private prisma: PrismaService) {}

  async createHomecare(branchId: string, data: CreateHomecareDTO): Promise<HomecareModel> {
    return this.prisma.homecare.create({ data: { branchId: branchId, ...data } });
  }

  async findHomecareByName(branchId: string, name: string): Promise<HomecareModel> {
    return this.prisma.homecare.findFirst({
      where: { branchId: branchId, name, deletedAt: null },
    });
  }

  async findHomecaresByBranchId(branchId: string): Promise<HomecareModel[]> {
    return this.prisma.homecare.findMany({ where: { branchId: branchId, deletedAt: null } });
  }

  async findHomecareById(homecareId: string): Promise<HomecareModel> {
    return this.prisma.homecare.findUnique({ where: { id: homecareId, deletedAt: null } });
  }

  async updateHomecareById(homecareId: string, data: UpdateHomecareDTO): Promise<HomecareModel> {
    return this.prisma.homecare.update({ where: { id: homecareId }, data: { ...data } });
  }

  async inactivateHomecareById(homecareId: string): Promise<HomecareModel> {
    return this.prisma.homecare.update({
      where: { id: homecareId },
      data: { deletedAt: globalFunction.getCurrentDateAndTime() },
    });
  }
}
