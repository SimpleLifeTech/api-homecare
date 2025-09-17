import { GlobalFunctions } from "@shared/shared/utils/functions";
import { PrismaService } from "src/database/prisma/prisma.service";
import { AddOrUpdateEmployeeDepartmentDTO } from "../dto/add-or-update-employee-to-department.dto";

const { getCurrentDateAndTime } = new GlobalFunctions();

export class DepartmentEmployeeRepository {
    constructor(private readonly prisma: PrismaService) {}

    async addSingleOrManyEmployee(data: AddOrUpdateEmployeeDepartmentDTO[]) {
        return await this.prisma.departmentEmployee.createMany({ data });
    }

    async findById(departmentEmployeeId: string) {
        return await this.prisma.departmentEmployee.findUnique({
            where: { id: departmentEmployeeId, deletedAt: null },
        });
    }

    async findByDepartmentId(departmentId: string) {
        return await this.prisma.departmentEmployee.findMany({
            where: { departmentId, deletedAt: null },
        });
    }

    async findAllByEmployeeId(employeeIds: string[], departmentId: string) {
        return await this.prisma.departmentEmployee.findMany({
            where: { employeeId: { in: employeeIds }, departmentId, deletedAt: null },
        });
    }

    async updateFeatureById(departmentEmployeeId: string, data: any) {
        return await this.prisma.departmentEmployee.update({
            where: { id: departmentEmployeeId, deletedAt: null },
            data,
        });
    }

    async inactivateSingleOrManyEmployee(employeeIds: string[], departmentId: string) {
        return await this.prisma.departmentEmployee.updateMany({
            where: { id: { in: employeeIds }, departmentId, deletedAt: null },
            data: { deletedAt: getCurrentDateAndTime() },
        });
    }
}