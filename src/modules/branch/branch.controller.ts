import { Body, Controller, Delete, Get, Param, Post, Put, Res } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { Response } from "express";

import { BranchService } from "./branch.service";
import { CreateBranchDTO } from "./dto/create-branch.dto";

const globalFunctions = new GlobalFunctions();

@Controller("branch")
export class BranchController {
  constructor(protected readonly branchService: BranchService) {}

  @Post("/create/:companyId")
  async createBranch(
    @Param("companyId") companyId: string,
    @Body() data: CreateBranchDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    globalFunctions.IsEmptyParam(companyId);
    const { codeHttp, ...response } = await this.branchService.createBranch(companyId, data);

    res.status(codeHttp).json(response);
  }

  @Get("/list/:companyId")
  async findBranchesByCompanyId(
    @Param("companyId") companyId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    globalFunctions.IsEmptyParam(companyId);
    const { codeHttp, ...response } = await this.branchService.findBranchesByCompanyId(companyId);

    res.status(codeHttp).json(response);
  }

  @Get("/list/:branchId")
  async findBranchById(
    @Param("branchId") branchId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    globalFunctions.IsEmptyParam(branchId);
    const { codeHttp, ...response } = await this.branchService.findBranchById(branchId);

    res.status(codeHttp).json(response);
  }

  @Put("/update/:branchId")
  async updateBranchById(
    @Param("branchId") branchId: string,
    @Body() data: CreateBranchDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    globalFunctions.IsEmptyParam(branchId);
    const { codeHttp, ...response } = await this.branchService.updateBranchById(branchId, data);

    res.status(codeHttp).json(response);
  }

  @Delete("/delete/:branchId")
  async deleteBranchById(
    @Param("branchId") branchId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    globalFunctions.IsEmptyParam(branchId);
    const { codeHttp, ...response } = await this.branchService.inactivateBranchById(branchId);

    res.status(codeHttp).json(response);
  }
}
