import { CompanyModule } from '@modules/company/company.module';
import { Module } from '@nestjs/common';
import { CacheRepository } from '@shared/shared/cache/cache.repository';
import { FileStorage } from '@shared/shared/externals/file-storage/file-storage';
import { StorageService } from '@shared/shared/externals/file-storage/file-storage.client';
import { PrismaModule } from 'src/database/prisma/prisma.module';
import { PrismaService } from 'src/database/prisma/prisma.service';

import { BranchController } from './branch.controller';
import { BranchService } from './branch.service';
import { BranchRepository } from './dao/branch.repository';

@Module({
  imports: [PrismaModule, CompanyModule],
  controllers: [BranchController],
  providers: [
    BranchService,
    StorageService,
    FileStorage,
    BranchRepository,
    CacheRepository,
    PrismaService,
  ],
})
export class BranchModule {}
