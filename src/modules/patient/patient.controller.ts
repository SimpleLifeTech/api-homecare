import { Body, Controller, Delete, Get, Param, Post, Put, Res } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { Response } from "express";

import { CreatePatientDto } from "./dto/create-patient.dto";
import { UpdatePatientDto } from "./dto/update-patient.dto";
import { PatientService } from "./patient.service";

const { IsEmptyParam } = new GlobalFunctions();

@Controller("patient")
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  async create(@Body() dto: CreatePatientDto, @Res({ passthrough: true }) res: Response) {
    const userToken = res.locals.userToken; // TODO: Get User By Token

    const { codeHttp, ...response } = await this.patientService.create(dto, userToken);

    res.status(codeHttp).json(response);
  }

  @Get()
  async findAll(@Res({ passthrough: true }) res: Response) {
    const { codeHttp, ...response } = await this.patientService.findAll();

    res.status(codeHttp).json(response);
  }

  @Get(":id")
  async findOne(@Param("id") id: string, @Res({ passthrough: true }) res: Response) {
    IsEmptyParam(id);
    const { codeHttp, ...response } = await this.patientService.findOne(id);

    res.status(codeHttp).json(response);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdatePatientDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    IsEmptyParam(id);
    const { codeHttp, ...response } = await this.patientService.update(id, dto);

    res.status(codeHttp).json(response);
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @Res({ passthrough: true }) res: Response) {
    IsEmptyParam(id);
    const { codeHttp, ...response } = await this.patientService.remove(id);

    res.status(codeHttp).json(response);
  }
}
