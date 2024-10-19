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
    return this.prisma.homecare.create({ data: { branch_id: branchId, ...data } });
  }

  async findHomecareByName(branchId: string, name: string): Promise<HomecareModel> {
    return this.prisma.homecare.findFirst({
      where: { branch_id: branchId, name, deleted_at: null },
    });
  }

  async findHomecaresByBranchId(branchId: string): Promise<HomecareModel[]> {
    return this.prisma.homecare.findMany({ where: { branch_id: branchId, deleted_at: null } });
  }

  async findHomecareById(homecareId: string): Promise<HomecareModel> {
    return this.prisma.homecare.findUnique({ where: { id: homecareId, deleted_at: null } });
  }

  async updateHomecareById(homecareId: string, data: UpdateHomecareDTO): Promise<HomecareModel> {
    return this.prisma.homecare.update({ where: { id: homecareId }, data: { ...data } });
  }

  async inactivateHomecareById(homecareId: string): Promise<HomecareModel> {
    return this.prisma.homecare.update({
      where: { id: homecareId },
      data: { deleted_at: globalFunction.getCurrentDateAndTime() },
    });
  }
}
