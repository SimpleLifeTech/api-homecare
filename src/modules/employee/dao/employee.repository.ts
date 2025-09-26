import { Injectable } from "@nestjs/common";
import { Employee } from "@prisma/client";
import { GlobalFunctions } from "@shared/shared/utils/functions";
import { PrismaService } from "src/database/prisma/prisma.service";

const { getCurrentDateAndTime } = new GlobalFunctions();

@Injectable()
export class EmployeeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createEmployee(data: Employee) {
    return await this.prisma.employee.create({ data });
  }

  async findEmployeeById(employeeId: string) {
    return await this.prisma.employee.findUnique({
      where: { id: employeeId, deletedAt: null },
    });
  }

  async findEmployeeByPersonIdAndBranchId(personId: string, branchId: string) {
    return await this.prisma.employee.findFirst({
      where: { branchId, personId, deletedAt: null },
    });
  }

  async findEmployeesByBranchId(branchId: string) {
    return await this.prisma.employee.findMany({
      where: { branchId, deletedAt: null },
    });
  }

  async updateEmployee(employeeId: string, data: Partial<Employee>) {
    return await this.prisma.employee.update({
      where: { id: employeeId },
      data,
    });
  }

  async inactivateEmployee(employeeId: string) {
    return await this.prisma.employee.update({
      where: { id: employeeId },
      data: { deletedAt: getCurrentDateAndTime() },
    });
  }
}
