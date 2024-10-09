import { Body, Controller, Delete, Get, Param, Post, Put, Res } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { Response } from "express";

import { CompanyService } from "./company.service";
import { CreateCompanyDTO } from "./dto/create-company.dto";
import { UpdateCompanyDTO } from "./dto/update-company.dto";

@Controller("company")
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly globalFunctions = new GlobalFunctions(),
  ) {}

  @Post("/create")
  async createCompany(@Body() body: CreateCompanyDTO, @Res() res: Response) {
    const { codeHttp, ...response } = await this.companyService.createCompany(body);

    return res.status(codeHttp).json(response);
  }

  @Get("/list/:companyId")
  async getCompanyById(@Param("companyId") companyId: string, @Res() res: Response) {
    this.globalFunctions.IsEmptyParam(companyId);

    const { codeHttp, ...response } = await this.companyService.findCompanyById(companyId);

    return res.status(codeHttp).json(response);
  }

  @Put("/update/:companyId")
  async updateCompany(
    @Param("companyId") companyId: string,
    @Body() body: UpdateCompanyDTO,
    @Res() res: Response,
  ) {
    this.globalFunctions.IsEmptyParam(companyId);

    const { codeHttp, ...response } = await this.companyService.updateCompany(companyId, body);

    return res.status(codeHttp).json(response);
  }

  @Delete("/delete/:companyId")
  async inactivateCompany(@Param("companyId") companyId: string, @Res() res: Response) {
    this.globalFunctions.IsEmptyParam(companyId);

    const { codeHttp, ...response } = await this.companyService.inactivateCompany(companyId);

    return res.status(codeHttp).json(response);
  }
}
