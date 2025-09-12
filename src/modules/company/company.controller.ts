import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { GlobalFunctions } from "@shared/shared/utils/functions";

import { CompanyService } from "./company.service";
import { CreateCompanyDTO } from "./dto/create-company.dto";
import { UpdateCompanyDTO } from "./dto/update-company.dto";

const { IsEmptyParam } = new GlobalFunctions();

@Controller("company")
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post("/create/:personId")
  @UseInterceptors(FileInterceptor("image"))
  async createCompany(
    @Param("personId") personId: string,
    @UploadedFile() image: Express.Multer.File,
    @Body() body: CreateCompanyDTO,
  ) {
    IsEmptyParam(personId);
    return this.companyService.createCompany(personId, body, image);
  }

  @Get("/list/:companyId")
  async getCompanyById(@Param("companyId") companyId: string) {
    IsEmptyParam(companyId);
    return this.companyService.findCompanyById(companyId);
  }

  @Get("/list-by-person/:personId")
  async getCompanyByPersonId(@Param("personId") personId: string) {
    IsEmptyParam(personId);
    return this.companyService.findCompanyByUserId(personId);
  }

  @Put("/update/:companyId")
  @UseInterceptors(FileInterceptor("image"))
  async updateCompany(
    @Param("companyId") companyId: string,
    @UploadedFile() image: Express.Multer.File,
    @Body() body: UpdateCompanyDTO,
  ) {
    IsEmptyParam(companyId);
    return this.companyService.updateCompany(companyId, body, image);
  }

  @Delete("/delete/:companyId")
  async inactivateCompany(@Param("companyId") companyId: string) {
    IsEmptyParam(companyId);
    return this.companyService.inactivateCompany(companyId);
  }
}
