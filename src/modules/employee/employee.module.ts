import { BranchModule } from '@modules/branch/branch.module';
import { PersonModule } from '@modules/person/person.module';
import { Module } from '@nestjs/common';
import { CacheRepository } from '@shared/shared/cache/cache.repository';
import { FileStorage } from '@shared/shared/externals/file-storage/file-storage';
import { StorageService } from '@shared/shared/externals/file-storage/file-storage.client';
import { PrismaModule } from 'src/database/prisma/prisma.module';
import { PrismaService } from 'src/database/prisma/prisma.service';

import { EmployeeRepository } from './dao/employee.repository';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';

@Module({
  imports: [BranchModule, PersonModule, PrismaModule],
  controllers: [EmployeeController],
  providers: [CacheRepository, EmployeeRepository, EmployeeService, StorageService, FileStorage, PrismaService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
