import { GlobalFunctions } from "@shared/shared/utils/functions";
import { PrismaService } from "src/database/prisma/prisma.service";

import { CreatePlanningDTO } from "../dto/create-planning.dto";
import { UpdatePlanningDTO } from "../dto/update-planning.dto";
import { Injectable } from "@nestjs/common";
import { Planning } from "@prisma/client";

const { getCurrentDateAndTime } = new GlobalFunctions();

@Injectable()
export class PlanningRepository {
  constructor(private readonly prisma: PrismaService) { }

  async createPlanning(data: Planning) {
    return this.prisma.planning.create({ data: { ...data } });
  };

  async findPlanningById(planningId: string) {
    return this.prisma.planning.findUnique({ where: { id: planningId, deletedAt: null } });
  };

  async findPlanningByBranchId(branchId: string) {
    return this.prisma.planning.findMany({
      where: { branchId, deletedAt: null }
    });
  };

  async updatePlanningById(planningId: string, data: Planning) {
    return this.prisma.planning.update({ where: { id: planningId }, data: { ...data } });
  }

  async inactivatePlanningById(planningId: string) {
    return this.prisma.planning.update({
      where: { id: planningId },
      data: { deletedAt: getCurrentDateAndTime() },
    });
  }
}
