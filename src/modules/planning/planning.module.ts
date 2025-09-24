import { CompanyModule } from '@modules/company/company.module';
import { Module } from '@nestjs/common';
import { CacheRepository } from '@shared/shared/cache/cache.repository';
import { FileStorage } from '@shared/shared/externals/file-storage/file-storage';
import { StorageService } from '@shared/shared/externals/file-storage/file-storage.client';
import { PrismaModule } from 'src/database/prisma/prisma.module';
import { PrismaService } from 'src/database/prisma/prisma.service';

import { PlanningController } from './planning.controller';
import { PlanningService } from './planning.service';
import { PlanningRepository } from './dao/planning.repository';
import { BranchModule } from '@modules/branch/branch.module';

@Module({
  imports: [PrismaModule, CompanyModule, BranchModule, PlanningModule],
  controllers: [PlanningController],
  providers: [
    PlanningService,
    StorageService,
    FileStorage,
    PlanningRepository,
    CacheRepository,
    PrismaService,
  ],
  exports: [PlanningRepository, PlanningService],
})
export class PlanningModule {}
