import { BranchRepository } from '@modules/branch/dao/branch.repository';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma/prisma.module';
import { PrismaService } from 'src/database/prisma/prisma.service';

import { DepartmentEmployeeRepository } from './dao/department-employee.repository';
import { DepartmentRepository } from './dao/department.repository';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';

@Module({
    imports: [PrismaModule],
    controllers: [DepartmentController],
    providers: [
        DepartmentService,
        BranchRepository,
        DepartmentRepository,
        DepartmentEmployeeRepository,
        PrismaService,
    ]
})
export class DepartmentModule {}