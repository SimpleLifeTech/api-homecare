import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";

import { PlanningService } from "./planning.service";
import { CreatePlanningDTO } from "./dto/create-planning.dto";

const { IsEmptyParam } = new GlobalFunctions();

@Controller("planning")
export class PlanningController {
  constructor(protected readonly planningService: PlanningService) {}

  @Post("/create/:branchId")
  async createPlanning(
    @Param("branchId") branchId: string,
    @Query("userId") userId: string,
    @Body() data: CreatePlanningDTO,
  ) {
    // TODO: Implementar o que vai passar
    IsEmptyParam(branchId);
    return this.planningService.createPlanning(branchId, userId, data);
  }

  // @Get("/list/:companyId")
  // async findPlanningByCompanyId(@Param("companyId") companyId: string) {
  //   IsEmptyParam(companyId);
  //   return this.planningService.findPlanningByCompanyId(companyId);
  // }

  // @Get("/list/:planningId")
  // async findPlanningById(@Param("planningId") planningId: string) {
  //   IsEmptyParam(planningId);
  //   return this.planningService.findPlanningById(planningId);
  // }

  // @Put("/update/:planningId")
  // async updatePlanningById(@Param("planningId") planningId: string, @Body() data: CreatePlanningDTO) {
  //   IsEmptyParam(planningId);
  //   return this.planningService.updatePlanningById(planningId, data);
  // }

  // @Delete("/delete/:planningId")
  // async deletePlanningById(@Param("planningId") planningId: string) {
  //   IsEmptyParam(planningId);
  //   return this.planningService.inactivatePlanningById(planningId);
  // }
}
