import { Body, Controller, Delete, Get, Param, Post, Put, Res } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { Response } from "express";

import { BranchService } from "./branch.service";
import { CreateBranchDTO } from "./dto/create-branch.dto";

@Controller("branch")
export class BranchController {
  constructor(
    protected readonly branchService: BranchService,
    protected readonly globalFunctions = new GlobalFunctions(),
  ) {}

  @Post("/create/:companyId")
  async createBranch(
    @Param("companyId") companyId: string,
    @Body() data: CreateBranchDTO,
    @Res() res: Response,
  ) {
    this.globalFunctions.IsEmptyParam(companyId);

    const { codeHttp, ...response } = await this.branchService.createBranch(companyId, data);

    return res.status(codeHttp).json(response);
  }

  @Get("/list/:companyId")
  async findBranchesByCompanyId(@Param("companyId") companyId: string, @Res() res: Response) {
    this.globalFunctions.IsEmptyParam(companyId);

    const { codeHttp, ...response } = await this.branchService.findBranchesByCompanyId(companyId);

    return res.status(codeHttp).json(response);
  }

  @Get("/list/:branchId")
  async findBranchById(@Param("branchId") branchId: string, @Res() res: Response) {
    this.globalFunctions.IsEmptyParam(branchId);

    const { codeHttp, ...response } = await this.branchService.findBranchById(branchId);

    return res.status(codeHttp).json(response);
  }

  @Put("/update/:branchId")
  async updateBranchById(
    @Param("branchId") branchId: string,
    @Body() data: CreateBranchDTO,
    @Res() res: Response,
  ) {
    this.globalFunctions.IsEmptyParam(branchId);

    const { codeHttp, ...response } = await this.branchService.updateBranchById(branchId, data);

    return res.status(codeHttp).json(response);
  }

  @Delete("/delete/:branchId")
  async deleteBranchById(@Param("branchId") branchId: string, @Res() res: Response) {
    this.globalFunctions.IsEmptyParam(branchId);

    const { codeHttp, ...response } = await this.branchService.inactivateBranchById(branchId);

    return res.status(codeHttp).json(response);
  }
}
