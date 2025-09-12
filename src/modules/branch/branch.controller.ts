import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";

import { BranchService } from "./branch.service";
import { CreateBranchDTO } from "./dto/create-branch.dto";

const { IsEmptyParam } = new GlobalFunctions();

@Controller("branch")
export class BranchController {
  constructor(protected readonly branchService: BranchService) {}

  @Post("/create/:companyId")
  async createBranch(@Param("companyId") companyId: string, @Body() data: CreateBranchDTO) {
    IsEmptyParam(companyId);
    return this.branchService.createBranch(companyId, data);
  }

  @Get("/list/:companyId")
  async findBranchesByCompanyId(@Param("companyId") companyId: string) {
    IsEmptyParam(companyId);
    return this.branchService.findBranchesByCompanyId(companyId);
  }

  @Get("/list/:branchId")
  async findBranchById(@Param("branchId") branchId: string) {
    IsEmptyParam(branchId);
    return this.branchService.findBranchById(branchId);
  }

  @Put("/update/:branchId")
  async updateBranchById(@Param("branchId") branchId: string, @Body() data: CreateBranchDTO) {
    IsEmptyParam(branchId);
    return this.branchService.updateBranchById(branchId, data);
  }

  @Delete("/delete/:branchId")
  async deleteBranchById(@Param("branchId") branchId: string) {
    IsEmptyParam(branchId);
    return this.branchService.inactivateBranchById(branchId);
  }
}
