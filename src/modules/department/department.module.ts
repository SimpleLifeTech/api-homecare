import { BranchModule } from '@modules/branch/branch.module';
import { Module } from '@nestjs/common';
import { CacheRepository } from '@shared/shared/cache/cache.repository';
import { PrismaModule } from 'src/database/prisma/prisma.module';
import { PrismaService } from 'src/database/prisma/prisma.service';

import { DepartmentEmployeeRepository } from './dao/department-employee.repository';
import { DepartmentRepository } from './dao/department.repository';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';

@Module({
    imports: [PrismaModule, BranchModule],
    controllers: [DepartmentController],
    providers: [
        DepartmentService,
        CacheRepository,
        DepartmentRepository,
        DepartmentEmployeeRepository,
        PrismaService,
    ]
})
export class DepartmentModule {}