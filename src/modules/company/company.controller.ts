import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { Response } from "express";

import { CompanyService } from "./company.service";
import { CreateCompanyDTO } from "./dto/create-company.dto";
import { UpdateCompanyDTO } from "./dto/update-company.dto";

const globalFunctions = new GlobalFunctions();
@Controller("company")
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post("/create/:personId")
  @UseInterceptors(FileInterceptor("image"))
  async createCompany(
    @Param("personId") personId: string,
    @UploadedFile() image: Express.Multer.File,
    @Body() body: CreateCompanyDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    globalFunctions.IsEmptyParam(personId);
    const { codeHttp, ...response } = await this.companyService.createCompany(
      personId,
      body,
      image,
    );

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
  @UseInterceptors(FileInterceptor("image"))
  async updateCompany(
    @Param("companyId") companyId: string,
    @UploadedFile() image: Express.Multer.File,
    @Body() body: UpdateCompanyDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    globalFunctions.IsEmptyParam(companyId);
    const { codeHttp, ...response } = await this.companyService.updateCompany(
      companyId,
      body,
      image,
    );

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
