import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";

import { CompanyFictionalService } from "./company-fictional.service";
import { CreateCompanyFictionalDTO } from "./dto/create-company-fictional.dto";
import { UpdateCompanyFictionalDTO } from "./dto/update-company-fictional.dto";

const { IsEmptyParam } = new GlobalFunctions();

@Controller("company-fictional")
export class CompanyFictionalController {
  constructor(private readonly companyFictionalService: CompanyFictionalService) {}

  @Post("/create")
  async createCompanyFictional(@Body() data: CreateCompanyFictionalDTO) {
    const getFromToken = "";
    //TODO!: Pegar do token aqui
    const companyIdWhoCreates = getFromToken;
    return await this.companyFictionalService.createCompanyFictional(data, companyIdWhoCreates);
  }

  @Get("/list/:companyFictionalId")
  async findCompanyFictionalById(@Param("companyFictionalId") companyFictionalId: string) {
    IsEmptyParam(companyFictionalId);
    return await this.companyFictionalService.findCompanyFictionalById(companyFictionalId);
  }

  @Get("/list/branch/:branchId")
  async findCompanyFictionalByBranchId(@Param("branchId") branchId: string) {
    IsEmptyParam(branchId);
    return await this.companyFictionalService.findCompanyFictionalByBranchId(branchId);
  }

  @Put("/update/:companyFictionalId")
  async updateCompanyFictional(
    @Param("companyFictionalId") companyFictionalId: string,
    @Body() data: UpdateCompanyFictionalDTO,
  ) {
    IsEmptyParam(companyFictionalId);
    return await this.companyFictionalService.updateCompanyFictional(companyFictionalId, data);
  }

  @Delete("/delete/:companyFictionalId")
  async delete(@Param("companyFictionalId") companyFictionalId: string) {
    IsEmptyParam(companyFictionalId);
    return await this.companyFictionalService.inactivateCompanyFictional(companyFictionalId);
  }
}
