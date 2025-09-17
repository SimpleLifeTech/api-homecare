import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { GlobalFunctions } from '@shared/shared/utils/functions';

import { DepartmentService } from './department.service';
import { AddOrUpdateEmployeeDepartmentDTO } from './dto/add-or-update-employee-to-department.dto';
import { CreateDepartmentDTO } from './dto/create-department.dto';
import { UpdateDepartmentDTO } from './dto/update-department.dto';

const { IsEmptyParam, IsValidArray } = new GlobalFunctions();

@Controller("department")
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post("/create")
  async create(@Body() data: CreateDepartmentDTO) {
    return await this.departmentService.createDepartment(data);
  }

  @Post("/add-employee")
  async addEmployee(@Body() data: AddOrUpdateEmployeeDepartmentDTO[]) {
    return await this.departmentService.addSingleOrManyEmployee(data);
  }

  @Get("/list/:departmentId")
  async findById(@Param("departmentId") departmentId: string) {
    IsEmptyParam(departmentId);
    return await this.departmentService.findDepartmentById(departmentId);
  }

  @Get("/list/department-employee/:departmentId")
  async findDepartmentEmployeeByDepartmentId(@Param("departmentId") departmentId: string) {
    IsEmptyParam(departmentId);
    return await this.departmentService.findDepartmentEmployeeByDepartmentId(departmentId);
  }

  @Get("/list/:branchId")
  async findDepartmentsByBranchId(@Param("branchId") branchId: string) {
    IsEmptyParam(branchId);
    return await this.departmentService.findDepartmentsByBranchId(branchId);
  }

  @Put("/update/:departmentId")
  async update(@Param("departmentId") departmentId: string, @Body() data: UpdateDepartmentDTO) {
    IsEmptyParam(departmentId);
    return await this.departmentService.updateDepartmentById(departmentId, data);
  }

  @Put("/update/department-employee/feature/:departmentEmployeeId")
  async updateFeature(
    @Param("departmentEmployeeId") departmentEmployeeId: string,
    @Body() data: AddOrUpdateEmployeeDepartmentDTO,
  ) {
    IsEmptyParam(departmentEmployeeId);
    return await this.departmentService.updateFeatureById(departmentEmployeeId, data);
  }

  @Delete("/delete/:departmentId")
  async delete(@Param("departmentId") departmentId: string) {
    IsEmptyParam(departmentId);
    return await this.departmentService.inactivateDepartmentById(departmentId);
  }

  @Delete("/delete/department-employee/:departmentEmployeeId")
  async deleteEmployee(
    @Param("departmentEmployeeId") departmentEmployeeId: string,
    @Query("employeeIds") employeeIds: string,
  ) {
    IsEmptyParam(departmentEmployeeId);
    const employeeIdsParsed = JSON.parse(employeeIds);
    IsValidArray(employeeIdsParsed);
    if (!employeeIdsParsed.every((id) => typeof id === "string"))
      throw new BadRequestException("Parâmetro malformado");
    return await this.departmentService.inactivateSingleOrManyEmployee(
      employeeIdsParsed,
      departmentEmployeeId,
    );
  }
}
