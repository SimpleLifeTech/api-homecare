import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { GlobalFunctions } from "@shared/shared/utils/functions";

import { CreatePatientDto } from "./dto/create-patient.dto";
import { UpdatePatientDto } from "./dto/update-patient.dto";
import { PatientService } from "./patient.service";

const { IsEmptyParam } = new GlobalFunctions();

@Controller("patient")
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post('/create')
  async create(@Body() dto: CreatePatientDto) {
    const userToken = ""; // TODO: Get User By Token
    return this.patientService.create(dto, userToken);
  }

  @Get('/list')
  async findAll() {
    return this.patientService.findAll();
  }

  @Get("/list/:id")
  async findOne(@Param("id") id: string) {
    IsEmptyParam(id);
    return this.patientService.findOne(id);
  }

  @Put("/update/:id")
  async update(@Param("id") id: string, @Body() dto: UpdatePatientDto) {
    IsEmptyParam(id);
    return this.patientService.update(id, dto);
  }

  @Delete("/delete/:id")
  async remove(@Param("id") id: string) {
    IsEmptyParam(id);
    return this.patientService.remove(id);
  }
}
