import { Body, Controller, Delete, Get, Param, Post, Put, Res } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { Response } from "express";

import { CompanyService } from "./company.service";
import { CreateCompanyDTO } from "./dto/create-company.dto";
import { UpdateCompanyDTO } from "./dto/update-company.dto";

const globalFunctions = new GlobalFunctions();
@Controller("company")
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post("/create/:person_id")
  async createCompany(
    @Param("person_id") personId: string,
    @Body() body: CreateCompanyDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { codeHttp, ...response } = await this.companyService.createCompany(personId, body);

    res.status(codeHttp).json(response);
  }

  @Get("/list/:companyId")
  async getCompanyById(
    @Param("companyId") companyId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    globalFunctions.IsEmptyParam(companyId);

    const { codeHttp, ...response } = await this.companyService.findCompanyById(companyId);

    res.status(codeHttp).json(response);
  }

  @Get("/list-by-person/:personId")
  async getCompanyByPersonId(
    @Param("personId") personId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    globalFunctions.IsEmptyParam(personId);

    const { codeHttp, ...response } = await this.companyService.findCompanyByUserId(personId);

    res.status(codeHttp).json(response);
  }

  @Put("/update/:companyId")
  async updateCompany(
    @Param("companyId") companyId: string,
    @Body() body: UpdateCompanyDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    globalFunctions.IsEmptyParam(companyId);

    const { codeHttp, ...response } = await this.companyService.updateCompany(companyId, body);

    res.status(codeHttp).json(response);
  }

  @Delete("/delete/:companyId")
  async inactivateCompany(
    @Param("companyId") companyId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    globalFunctions.IsEmptyParam(companyId);

    const { codeHttp, ...response } = await this.companyService.inactivateCompany(companyId);

    res.status(codeHttp).json(response);
  }
}
