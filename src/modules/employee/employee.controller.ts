import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { GlobalFunctions } from "@shared/shared/utils/functions";

import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { EmployeeService } from "./employee.service";
import { CreateEmployeeDto } from "./dto/create-employee.dto";

const { IsEmptyParam } = new GlobalFunctions();

@Controller("employee")
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post("/create")
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "personalDocument", maxCount: 1 },
      { name: "professionalDocument", maxCount: 1 },
      { name: "criminalRecord", maxCount: 1 },
      { name: "resume", maxCount: 1 },
    ]),
  )
  async create(
    @UploadedFiles()
    files: {
      personalDocument?: Express.Multer.File[];
      professionalDocument?: Express.Multer.File[];
      criminalRecord?: Express.Multer.File[];
      resume?: Express.Multer.File[];
    },
    @Body() data: CreateEmployeeDto,
  ) {
    return await this.employeeService.createEmployee(
      data,
      files.personalDocument?.[0],
      files.professionalDocument?.[0],
      files.criminalRecord?.[0],
      files.resume?.[0],
    );
  }

  @Get("/list/:employeeId")
  async findById(@Param("employeeId") employeeId: string) {
    IsEmptyParam(employeeId);
    return await this.employeeService.findEmployeeById(employeeId);
  }

  @Get("/list-by-branch/:branchId")
  async findEmployeesByBranchId(@Param("branchId") branchId: string) {
    IsEmptyParam(branchId);
    return await this.employeeService.findEmployeesByBranchId(branchId);
  }

  @Put("/update/:employeeId")
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "personalDocument", maxCount: 1 },
      { name: "professionalDocument", maxCount: 1 },
      { name: "criminalRecord", maxCount: 1 },
      { name: "resume", maxCount: 1 },
    ]),
  )
  async updateEmployee(
    @Param("employeeId") employeeId: string,
    @UploadedFiles()
    files: {
      personalDocument?: Express.Multer.File[];
      professionalDocument?: Express.Multer.File[];
      criminalRecord?: Express.Multer.File[];
      resume?: Express.Multer.File[];
    },
    @Body() data: UpdateEmployeeDto,
  ) {
    IsEmptyParam(employeeId);

    return this.employeeService.updateEmployee(
      employeeId,
      data,
      files.personalDocument?.[0],
      files.professionalDocument?.[0],
      files.criminalRecord?.[0],
      files.resume?.[0],
    );
  }

  @Delete("/delete/:employeeId")
  async inactivateEmployee(@Param("employeeId") employeeId: string) {
    IsEmptyParam(employeeId);
    return this.employeeService.inactivateEmployee(employeeId);
  }
}
