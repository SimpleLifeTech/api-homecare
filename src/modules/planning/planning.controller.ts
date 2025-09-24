import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";

import { PlanningService } from "./planning.service";
import { CreatePlanningDTO } from "./dto/create-planning.dto";

const { IsEmptyParam } = new GlobalFunctions();

@Controller("planning")
export class PlanningController {
  constructor(protected readonly planningService: PlanningService) {}

  @Post("/create/:companyId")
  async createPlanning(@Param("companyId") companyId: string, @Body() data: CreatePlanningDTO) {
    IsEmptyParam(companyId);
    return this.planningService.createPlanning(companyId, data);
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
