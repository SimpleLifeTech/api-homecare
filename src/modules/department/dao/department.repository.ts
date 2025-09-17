import { GlobalFunctions } from '@shared/shared/utils/functions';
import { PrismaService } from 'src/database/prisma/prisma.service';

import { CreateDepartmentDTO } from '../dto/create-department.dto';
import { UpdateDepartmentDTO } from '../dto/update-department.dto';

const { getCurrentDateAndTime } = new GlobalFunctions();

export class DepartmentRepository {
    constructor(private readonly prisma: PrismaService) {}

    async createDepartment(data: CreateDepartmentDTO) {
        return await this.prisma.department.create({ data });
    }

    async createDepartmentWithEmployees(data: CreateDepartmentDTO, employees: any[]) {
        return await this.prisma.$transaction([
            this.prisma.department.create({ data }),
            this.prisma.departmentEmployee.createMany({ data: employees }),
        ]);
    }

    async findDepartmentById(departmentId: string) {
        return await this.prisma.department.findUnique({
            where: { id: departmentId, deletedAt: null },
        });
    }

    async findDepartmentByName(name: string, branchId: string) {
        return await this.prisma.department.findFirst({
            where: { name, branchId, deletedAt: null },
        });
    }

    async findDepartmentsByBranchId(branchId: string) {
        return await this.prisma.department.findMany({
            where: { branchId, deletedAt: null },
        });
    }

    async updateDepartmentById(departmentId: string, data: UpdateDepartmentDTO) {
        return await this.prisma.department.update({
            where: { id: departmentId },
            data,
        });
    }

    async inactivateDepartmentById(departmentId: string) {
        return await this.prisma.department.update({
            where: { id: departmentId },
            data: { deletedAt: getCurrentDateAndTime() },
        });
    }
}